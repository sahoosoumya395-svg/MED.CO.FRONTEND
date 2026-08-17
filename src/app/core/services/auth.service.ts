import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
  captcha: string;
  captchaId: string;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    role: string;
    name: string;
    token: string;
  };
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
  private apiUrl = 'http://localhost:8082/api/auth';
  constructor(private http: HttpClient) {}

  /**
   * 1. Mock Captcha (JSON response)
   */
  createCaptcha(): Observable<any> {
    return this.http.get(`${this.apiUrl}/create-captcha`);
  }

  createCaptchaBlob(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/create-captcha`, { responseType: 'blob' });
  }

  createCaptchaText(): Observable<string> {
    return this.http.get(`${this.apiUrl}/create-captcha`, { responseType: 'text' });
  }
 login(credentials: LoginRequest): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(
    `${this.apiUrl}/login`,
    credentials
  );
}

  /**
   * 3. Forgot Password
   */
  forgotPassword(data: ForgotPasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, data);
  }

  /**
   * 3b. Resend OTP
   */
  resendOtp(data: ForgotPasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, data);
  }

  /**
   * 4. Verify OTP
   */
  verifyOtp(data: VerifyOtpRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, data);
  }

  /**
   * 5. Reset Password
   */
  resetPassword(data: ResetPasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
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
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const name = payload.name || payload.userName || payload.sub;
        if (name) {
          localStorage.setItem('user_name', name);
        }
      } catch (e) {
        // ignore decoding errors
      }
    }
  }

  saveUserName(name: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('user_name', name);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  getUserName(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('user_name');
    }
    return null;
  }

  clearToken(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_name');
    }
  }
}
