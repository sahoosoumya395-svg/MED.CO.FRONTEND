import { Component } from '@angular/core';


@Component({
  selector: 'app-forgot-password',
  imports: [],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {}

import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPassword {

  email: string = '';

  constructor(private router: Router) {}

  getOtp() {
    console.log('Get OTP', this.email);
    this.router.navigate(['/reset-password']);
  }

  resendOtp() {
    console.log('Resend OTP');
  }

}



