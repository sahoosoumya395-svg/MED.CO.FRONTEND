import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface LoginRequest {
  email?: string;
  username?: string;
  password?: string;
  captchaId?: string;
  captchaAnswer?: string;
}

export interface LoginResponse {
  token?: string;
  jwtToken?: string;
  accessToken?: string;
  role?: string;
  username?: string;
  email?: string;
  message?: string;
  status?: boolean | string;
  [key: string]: any;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email?: string;
  otp?: string;
}

export interface ResetPasswordRequest {
  email?: string;
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface CaptchaResponse {
  captchaId?: string;
  captchaImage?: string;
  captchaBase64?: string;
  captchaUrl?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http?: HttpClient) {}

  /**
   * 1. Mock Captcha (JSON response)
   */
  createCaptcha(): Observable<CaptchaResponse> {
    return of({
      captchaId: 'MOCK_CAPTCHA_123',
      captchaText: 'XGPTQ',
      status: true
    });
  }

  /**
   * 1b. Mock Captcha Blob
   */
  createCaptchaBlob(): Observable<Blob> {
    return of(new Blob([], { type: 'image/png' }));
  }

  /**
   * 1c. Mock Captcha Text
   */
  createCaptchaText(): Observable<string> {
    return of('XGPTQ');
  }

  /**
   * 2. Mock Login
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    const userRole = credentials.email?.toLowerCase().includes('doctor') ? 'DOCTOR' :
                     credentials.email?.toLowerCase().includes('patient') ? 'PATIENT' : 'ADMIN';
    return of({
      token: 'mock-jwt-token-xyz-12345',
      jwtToken: 'mock-jwt-token-xyz-12345',
      accessToken: 'mock-jwt-token-xyz-12345',
      role: userRole,
      username: credentials.username || credentials.email || 'mockuser',
      email: credentials.email || 'user@healthbridge.com',
      message: 'Login successful (Mock Mode)',
      status: true
    });
  }

  /**
   * 3. Mock Forgot Password
   */
  forgotPassword(data: ForgotPasswordRequest): Observable<any> {
    return of({
      status: true,
      success: true,
      message: 'OTP sent successfully to your email address (Mock Mode)',
      otp: '123456'
    });
  }

  /**
   * 3b. Mock Resend OTP
   */
  resendOtp(data: ForgotPasswordRequest): Observable<any> {
    return of({
      status: true,
      success: true,
      message: 'A new OTP has been sent successfully to your email address (Mock Mode)',
      otp: '123456'
    });
  }

  /**
   * 4. Mock Verify OTP
   */
  verifyOtp(data: VerifyOtpRequest): Observable<any> {
    return of({
      status: true,
      success: true,
      valid: true,
      message: 'OTP verified successfully (Mock Mode)'
    });
  }

  /**
   * 5. Mock Reset Password
   */
  resetPassword(data: ResetPasswordRequest): Observable<any> {
    return of({
      status: true,
      success: true,
      message: 'Password reset successfully (Mock Mode)'
    });
  }

  /**
   * 6. Mock Logout
   */
  logout(): Observable<any> {
    return of({
      status: true,
      message: 'Logged out successfully (Mock Mode)'
    });
  }

  /**
   * Local Storage Helper Methods
   */
  saveToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  clearToken(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
    }
  }
}
