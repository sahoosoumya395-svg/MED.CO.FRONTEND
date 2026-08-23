import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8082/api/auth';

  constructor(private http: HttpClient) {}

  // =========================
  // LOGIN
  // =========================
  login(loginData: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/login`,
      loginData
    ).pipe(
      tap((response: any) => {

        console.log('Login response:', response);

        /*
         * Your backend may return the token in different structures.
         * Store it if available.
         */

        const token =
          response?.token ||
          response?.data?.token ||
          response?.accessToken ||
          response?.data?.accessToken;

        if (token) {
          localStorage.setItem('token', token);
        }

        /*
         * Save email if backend returns it.
         */
        const email =
          response?.email ||
          response?.data?.email ||
          response?.user?.email ||
          response?.data?.user?.email;

        if (email) {
          localStorage.setItem('userEmail', email);
        }

        /*
         * Save username/name if available.
         */
        const name =
          response?.name ||
          response?.userName ||
          response?.data?.name ||
          response?.data?.userName ||
          response?.user?.name ||
          response?.data?.user?.name;

        if (name) {
          localStorage.setItem('userName', name);
        }

        /*
         * Save role if available.
         */
        const role =
          response?.role ||
          response?.data?.role ||
          response?.user?.role ||
          response?.data?.user?.role;

        if (role) {
          localStorage.setItem('userRole', role);
        }
      })
    );
  }


  // =========================
  // GET TOKEN
  // =========================
  getToken(): string | null {
    return localStorage.getItem('token');
  }


  // =========================
  // GET USER EMAIL
  // =========================
  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }


  // =========================
  // GET USER NAME
  // =========================
  getUserName(): string | null {
    return localStorage.getItem('userName');
  }


  // =========================
  // GET USER ROLE
  // =========================
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }


  // =========================
  // CHECK LOGIN
  // =========================
  isLoggedIn(): boolean {
    return !!this.getToken();
  }


  // =========================
  // CAPTCHA
  // =========================
  createCaptcha(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/create-captcha`
    );
  }


  // =========================
  // LOGOUT
  // =========================
  logout(): Observable<any> {

    const token = this.getToken();

    /*
     * If your backend logout endpoint requires authentication,
     * the interceptor will automatically send the token.
     */

    return this.http.post<any>(
      `${this.apiUrl}/logout`,
      {}
    ).pipe(
      tap(() => {
        this.clearSession();
      })
    );
  }


  // =========================
  // CLEAR SESSION
  // =========================
  clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
  }


  // =========================
  // FORGOT PASSWORD
  // =========================
  forgotPassword(email: string): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/forgot-password`,
      {
        email: email
      }
    );
  }


  // =========================
  // VERIFY OTP
  // =========================
  verifyOtp(data: any): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/verify-otp`,
      data
    );
  }


  // =========================
  // RESET PASSWORD
  // =========================
  resetPassword(data: any): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/reset-password`,
      data
    );
  }
}
