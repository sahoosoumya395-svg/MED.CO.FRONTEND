import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(private router: Router) {}

  login() {
    console.log("Sign In clicked");
    this.router.navigate(['/billing']);
  }

  goToRegister() {
    console.log("Sign Up clicked");
    this.router.navigate(['/register']);
  }

  forgotPassword(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    console.log("Forgot Password clicked");
    this.router.navigate(['/forgot-password']);
  }

}
