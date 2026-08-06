
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DoctorService } from '../services/doctor';
import { Router } from '@angular/router';
export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-doctor-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './doctor-add.html',
  styleUrl: './doctor-add.css',
})
export class DoctorAdd implements OnInit {
  doctorForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.doctorForm = this.fb.group(
      {
        firstName: ['', Validators.required],

        middleName: [''],

        lastName: ['', Validators.required],

        gender: ['', Validators.required],

        dateOfBirth: ['', Validators.required],

        bloodGroup: ['', Validators.required],

        nationality: ['', Validators.required],

        registrationCode: ['', [Validators.required, Validators.pattern(/^7$/)]],

        mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],

        alternateMobileNumber: ['', Validators.pattern(/^[6-9]\d{9}$/)],

        email: ['', [Validators.required, Validators.email]],

        address: ['', Validators.required],

        city: ['', Validators.required],

        state: ['', Validators.required],

        country: ['', Validators.required],

        pinCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],

        medicalRegistrationNumber: ['', Validators.required],

        qualification: ['', Validators.required],

        specialization: ['', Validators.required],

        experience: ['', [Validators.required, Validators.min(0)]],

        departmentId: ['', Validators.required],

        designation: ['', Validators.required],

        username: ['', Validators.required],

        password: ['', [Validators.required, Validators.minLength(8)]],

        confirmPassword: ['', Validators.required],

        acceptTerms: [false, Validators.requiredTrue],
      },
      {
        validators: passwordMatchValidator,
      },
    );
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  passwordsMatch(): boolean {
    return this.doctorForm.get('password')?.value === this.doctorForm.get('confirmPassword')?.value;
  }

  registerDoctor() {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      return;
    }

    if (!this.passwordsMatch()) {
      this.errorMessage = 'Password and Confirm Password do not match';
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';
    this.loading = true;

    this.doctorService.registerDoctor(this.doctorForm.value).subscribe({
      next: (response) => {
        this.loading = false;

        console.log(response);

        this.successMessage = 'Doctor Registered Successfully.';
        this.errorMessage = '';

        this.doctorForm.reset({
          nationality: 'Indian',
          country: 'India',
          acceptTerms: false,
        });

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },

      error: (error) => {
        this.loading = false;

        this.successMessage = '';

        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.error?.errors) {
          this.errorMessage = Object.values(error.error.errors).join(', ');
        } else {
          this.errorMessage = 'Registration Failed. Please try again.';
        }
      },
    });
  }
}

