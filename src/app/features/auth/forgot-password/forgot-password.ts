import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword implements OnDestroy {
  email = '';
  otpDigits: string[] = ['', '', '', '', '', ''];

  isLoading = false;
  successMessage = '';
  errorMessage = '';
  resendCooldown = 0;
  sentOtp: string | null = null;
  private timerInterval: any = null;
  private errorTimer: any = null;

  private showError(message: string): void {
    this.errorMessage = message;
    this.cdr.detectChanges();
    if (this.errorTimer) {
      clearTimeout(this.errorTimer);
    }
    this.errorTimer = setTimeout(() => {
      this.errorMessage = '';
      this.cdr.detectChanges();
    }, 5000);
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  getOtp(): void {
    if (!this.email) {
      this.showError('Please enter your registered email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.showError('Invalid email address format.');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.forgotPassword({ email: this.email }).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log('Forgot Password OTP sent response:', res);

        if (res.statusCode !== 200) {
          this.showError(res.message || 'Failed to send OTP.');
          return;
        }

        this.sentOtp = res?.otp || res?.data?.otp || res?.otpCode || res?.code || null;
        this.successMessage = 'OTP sent successfully to your email';
        this.startResendTimer(30);
        this.cdr.detectChanges();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 5000);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Forgot Password API error:', err);
        this.showError(err.error?.message || err.error?.error || 'Failed to send OTP. Please check your email.');
      }
    });
  }

  resendOtp(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (this.resendCooldown > 0 || this.isLoading) {
      return;
    }

    if (!this.email) {
      this.showError('Please enter your registered email address.');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.otpDigits = ['', '', '', '', '', ''];

    this.authService.resendOtp({ email: this.email }).subscribe({
      next: (res) => {
        this.handleResendSuccess(res);
      },
      error: (err) => {
        if (err.status === 404) {
          this.authService.forgotPassword({ email: this.email }).subscribe({
            next: (res) => this.handleResendSuccess(res),
            error: (fallbackErr) => this.handleResendError(fallbackErr)
          });
        } else {
          this.handleResendError(err);
        }
      }
    });
  }

  private handleResendSuccess(res: any): void {
    this.isLoading = false;
    console.log('Resend OTP response:', res);
    this.sentOtp = res?.otp || res?.data?.otp || res?.otpCode || res?.code || null;
    this.successMessage = 'OTP sent successfully to your email';
    this.startResendTimer(30);
    this.cdr.detectChanges();
    setTimeout(() => {
      this.successMessage = '';
      this.cdr.detectChanges();
    }, 5000);
  }

  private handleResendError(err: any): void {
    this.isLoading = false;
    console.error('Resend OTP API error:', err);
    this.showError(err.error?.message || err.error?.error || 'Failed to resend OTP. Please check your email.');
  }

  startResendTimer(seconds: number): void {
    this.resendCooldown = seconds;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  verifyAndProceed(): void {
    if (!this.email) {
      this.showError('Please enter your registered email address.');
      return;
    }

    const fullOtp = this.otpDigits.join('').trim();
    if (!fullOtp || fullOtp.length < 4) {
      this.showError('Please enter the full OTP received in your email.');
      return;
    }

    // Strict local OTP verification check if captured from response
    if (this.sentOtp && fullOtp !== String(this.sentOtp).trim()) {
      this.showError('Incorrect OTP. Please enter the correct OTP sent in your email.');
      return; // DO NOT NAVIGATE IF OTP IS INCORRECT
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Verify OTP with backend API
    this.authService.verifyOtp({ email: this.email, otp: fullOtp }).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log('OTP Verification response:', res);

        if (res && (res.statusCode !== 200 || res.status === false || res.success === false || res.valid === false || res.error)) {
          this.showError(res.message || res.error || 'Incorrect OTP. Please enter the correct OTP sent in your email.');
          return; // DO NOT NAVIGATE IF OTP IS INCORRECT
        }

        // ONLY NAVIGATE TO RESET PASSWORD WHEN OTP IS VALID & VERIFIED!
        this.navigateToResetPassword(fullOtp);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Verify OTP API error:', err);

        // DO NOT NAVIGATE AUTOMATICALLY ON ERROR OR INCORRECT OTP
        this.showError(err.error?.message || err.error?.error || 'Incorrect OTP. Verification failed. Please check your OTP and try again.');
      }
    });
  }

  private navigateToResetPassword(fullOtp: string): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem('reset_email', this.email);
      sessionStorage.setItem('reset_otp', fullOtp);
    }
    this.router.navigate(['/reset-password'], {
      state: { email: this.email, otp: fullOtp }
    });
  }

  onOtpInput(event: any, index: number): void {
    const val = event.target.value;
    if (val && index < 5) {
      const nextInput = event.target.nextElementSibling;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const prevInput = (event.target as HTMLElement).previousElementSibling as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text')?.trim() || '';
    if (pastedData) {
      const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        this.otpDigits[i] = digits[i] || '';
      }
    }
  }
}
