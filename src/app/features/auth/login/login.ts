import { Component } from '@angular/core';


@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}
=======
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
  }

  forgotPassword(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    console.log("Forgot Password clicked");
    this.router.navigate(['/forgot-password']);
  }

}



