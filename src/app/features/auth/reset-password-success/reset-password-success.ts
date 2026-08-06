import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reset-password-success.html',
  styleUrls: ['./reset-password-success.css']
})
export class ResetPasswordSuccess {

  constructor(private router: Router){}

  continueToLogin(){
    this.router.navigate(['/login']);
  }

}