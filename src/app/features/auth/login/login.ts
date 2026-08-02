import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from '../../../core/services/auth.service';

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

  constructor(
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Generate initial captcha code immediately on creation
    this.captchaDisplayCode = this.generateRandomCaptcha();
    this.captchaId = 'CAPTCHA_' + this.captchaDisplayCode;
    this.updateCaptchaChars();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Automatically load real Captcha from API on page open
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
          this.captchaId = res.captchaId || res.id || res.key || res.captchaKey || (typeof res === 'string' ? res : this.captchaId);
          this.captchaDisplayCode = res.captchaText || res.captchaCode || res.text || (typeof res === 'string' ? res : this.captchaDisplayCode);
          this.updateCaptchaChars();

          const rawImage = res.captchaImage || res.captchaBase64 || res.image || res.captchaUrl || '';
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

  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email/username and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const credentials = {
      email: this.email,
      username: this.email,
      password: this.password,
      captchaId: this.captchaId,
      captchaAnswer: this.captchaAnswer
    };

    console.log('Sending login credentials payload:', credentials);

    this.authService.login(credentials).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = 'Login Successful! Redirecting to Dashboard...';
        console.log('Login API success response:', res);
        
        // Save JWT token if provided by backend
        const token = res.token || res.jwtToken || res.accessToken;
        if (token) {
          this.authService.saveToken(token);
        }

        // Redirect based on role or default to admin dashboard
        setTimeout(() => {
          const role = (res.role || '').toUpperCase();
          if (role === 'DOCTOR') {
            this.router.navigate(['/doctor-dashboard']);
          } else if (role === 'PATIENT') {
            this.router.navigate(['/patient-dashboard']);
          } else {
            this.router.navigate(['/admin-dashboard']);
          }
        }, 800);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login API error details:', err);
        this.errorMessage = err.error?.message || err.error?.error || 'Invalid credentials or server connection error. Please try again.';
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  forgotPassword(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.router.navigate(['/forgot-password']);
  }
}
