import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {
  email = '';
  otp = '';
  newPassword = '';
  confirmPassword = '';

  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state || (typeof window !== 'undefined' ? window.history?.state : null);
    if (state && (state['email'] || state['otp'])) {
      this.email = state['email'] || '';
      this.otp = state['otp'] || '';
    }

    if (!this.email && typeof window !== 'undefined' && window.sessionStorage) {
      this.email = sessionStorage.getItem('reset_email') || '';
    }
    if (!this.otp && typeof window !== 'undefined' && window.sessionStorage) {
      this.otp = sessionStorage.getItem('reset_otp') || '';
    }
  }

  ngOnInit(): void {
  }

  resetPassword(): void {
    if (!this.email) {
      this.errorMessage = 'Please enter your registered email address.';
      return;
    }

    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Please fill in both new password and confirm password.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New password and confirm password do not match.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      email: this.email,
      otp: this.otp,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    };

    this.authService.resetPassword(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log('Reset Password success response:', res);
        this.router.navigate(['/reset-password-success']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Reset Password API error:', err);
        this.errorMessage = err.error?.message || err.error?.error || 'Failed to reset password. Please check requirement criteria.';
      }
    });
  }
}
