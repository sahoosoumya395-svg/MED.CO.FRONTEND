import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) {}

  resetPassword() {
    if (this.newPassword && this.confirmPassword && this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    this.router.navigate(['/reset-password-success']);
  }
}
