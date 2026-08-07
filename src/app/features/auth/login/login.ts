import { Component, Inject, OnInit, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from '../../../core/services/auth.service';
import { encryptPassword } from '../../../core/utils/encryption.util';

export interface CaptchaChar {
  char: string;
  color: string;
  fontSize: string;
  offsetY: string;
  rotate: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  email = '';
  password = '';
  captchaAnswer = '';
  captchaId = '';
  captchaDisplayCode = '';
  captchaChars: CaptchaChar[] = [];
  captchaImageSrc: SafeUrl | string = '';

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  private errorTimer: any = null;
  private successTimer: any = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    this.captchaDisplayCode = 'BRIDGE';
    this.captchaId = 'CAPTCHA_BRIDGE';
    this.updateCaptchaChars();
  }

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

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.cdr.detectChanges();
    if (this.successTimer) {
      clearTimeout(this.successTimer);
    }
    this.successTimer = setTimeout(() => {
      this.successMessage = '';
      this.cdr.detectChanges();
    }, 5000);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.captchaDisplayCode = this.generateRandomCaptcha();
      this.captchaId = 'CAPTCHA_' + this.captchaDisplayCode;
      this.updateCaptchaChars();
      this.loadCaptcha();
    }
  }

  updateCaptchaChars(): void {
    const palette = ['#1e3a8a', '#15803d', '#16a34a', '#4d7c0f', '#334155', '#2563eb', '#b45309', '#0369a1'];
    const fontSizes = ['22px', '25px', '23px', '26px', '24px'];
    const offsets = ['-3px', '2px', '-1px', '3px', '-2px'];
    const rotations = ['-8deg', '6deg', '-4deg', '8deg', '-5deg'];

    const str = this.captchaDisplayCode || 'XGPTQ';
    this.captchaChars = str.split('').map((char, index) => {
      return {
        char: char,
        color: palette[index % palette.length],
        fontSize: fontSizes[index % fontSizes.length],
        offsetY: offsets[index % offsets.length],
        rotate: rotations[index % rotations.length]
      };
    });
  }

  loadCaptcha(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Call backend API GET /api/auth/create-captcha
    this.authService.createCaptcha().subscribe({
      next: (res: any) => {
        console.log('GET /api/auth/create-captcha JSON response:', res);
        if (res) {
          const data = res.data || res;
          this.captchaId = data.captchaId || data.id || data.key || data.captchaKey || (typeof res === 'string' ? res : this.captchaId);
          this.captchaDisplayCode = data.captchaText || data.captchaCode || data.text || (typeof res === 'string' ? res : this.captchaDisplayCode);
          this.updateCaptchaChars();

          const rawImage = data.captchaImage || data.captchaBase64 || data.image || data.captchaUrl || '';
          if (rawImage && rawImage.length > 20) {
            if (rawImage.startsWith('data:image') || rawImage.startsWith('http') || rawImage.startsWith('/')) {
              this.captchaImageSrc = this.sanitizer.bypassSecurityTrustUrl(rawImage);
            } else {
              this.captchaImageSrc = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${rawImage}`);
            }
          }
        }
      },
      error: (err) => {
        console.warn('JSON captcha endpoint notice, fetching raw image/text stream:', err);
        // Fallback 1: Try fetching direct binary image stream
        this.authService.createCaptchaBlob().subscribe({
          next: (blob: Blob) => {
            if (blob && blob.size > 0) {
              const objectUrl = URL.createObjectURL(blob);
              this.captchaImageSrc = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
            }
          },
          error: () => {
            // Fallback 2: Try raw text string
            this.authService.createCaptchaText().subscribe({
              next: (text: string) => {
                if (text) {
                  this.captchaDisplayCode = text.trim();
                  this.captchaId = text.trim();
                  this.updateCaptchaChars();
                }
              },
              error: () => {
                // Backend on 8082 offline notice: dynamic initial captcha remains active
              }
            });
          }
        });
      }
    });
  }

  generateRandomCaptcha(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  refreshCaptcha(): void {
    this.captchaImageSrc = '';
    this.captchaDisplayCode = this.generateRandomCaptcha();
    this.captchaId = 'CAPTCHA_' + this.captchaDisplayCode;
    this.updateCaptchaChars();
    this.loadCaptcha();
  }

  async login(): Promise<void> {
    if (!this.email || !this.password) {
      this.showError('Please enter both email/username and password.');
      return;
    }

    if (!this.captchaAnswer) {
      this.showError('Please enter the captcha.');
      return;
    }

    // Local captcha check ONLY IF we aren't displaying a backend image stream
    if (this.captchaDisplayCode && !this.captchaImageSrc && this.captchaAnswer.trim().toLowerCase() !== this.captchaDisplayCode.trim().toLowerCase()) {
      this.showError('Invalid captcha');
      // Intentionally not refreshing here so user can quickly fix their local typo
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const encryptedPassword = await encryptPassword(this.password);

    const credentials = {
      email: this.email,
      password: encryptedPassword,
      captcha: this.captchaAnswer,
      captchaId: this.captchaId

    };

    console.log('Sending login credentials payload:', credentials);

   this.authService.login(credentials).subscribe({
  next: (res: any) => {

    this.isLoading = false;

    // Check if backend returned 200 HTTP but a custom error status inside
    if (res && res.statusCode !== undefined && res.statusCode !== 200) {
      const errorMsg = res.message?.toLowerCase() || '';
      if (errorMsg.includes('captcha')) {
        this.showError('Invalid captcha');
      } else {
        // As a best security practice, combine email and password errors
        this.showError('Incorrect email or password');
      }
      this.refreshCaptcha();
      return;
    }

    this.showSuccess('Login successfully');
const token = res.data?.token;
const role = res.data?.role;
const name = res.data?.name;
const doctorId = res.data?.id;


if (token) {
  this.authService.saveToken(token);
}

if (name) {
  this.authService.saveUserName(name);
}

if (doctorId != null) {
  localStorage.setItem('doctorId', doctorId.toString());
}

    setTimeout(() => {
      switch (role) {
        case 'ADMIN':
          this.router.navigate(['/admin-dashboard']);
          break;

        case 'DOCTOR':
          this.router.navigate(['/doctor-dashboard']);
          break;

        case 'PATIENT':
          this.router.navigate(['/patient-dashboard']);
          break;

        default:
          this.router.navigate(['/']);
      }
    }, 800);
  },

  error: (err) => {
    this.isLoading = false;
    console.error('Login API error:', err);

    const backendMsg = err.error?.message || err.error?.error || '';
    const lowerMsg = backendMsg.toLowerCase();

    if (lowerMsg.includes('captcha')) {
      this.showError('Invalid captcha');
    } else {
      // Standard security practice to not leak whether email is registered or password is wrong
      this.showError('Incorrect email or password');
    }

    this.refreshCaptcha();
  }
});
  }
  goToRegister(): void {
    this.router.navigate(['/pre-register']);
  }

  forgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}
