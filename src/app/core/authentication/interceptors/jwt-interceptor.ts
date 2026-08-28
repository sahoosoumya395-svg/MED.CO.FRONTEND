import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getToken();
  console.log('Request URL:', req.url);
console.log('JWT Token:', token);

  // Skip adding the token for auth endpoints
 if (
  req.url.includes('/auth/login') ||
  req.url.includes('/auth/create-captcha') ||
  req.url.includes('/auth/forgot-password') ||
  req.url.includes('/auth/verify-otp') ||
  req.url.includes('/auth/reset-password')
) {
  return next(req);
}

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
