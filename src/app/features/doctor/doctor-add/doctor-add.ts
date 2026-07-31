
import { Component } from '@angular/core';

@Component({
  selector: 'app-doctor-add',
  imports: [],
  templateUrl: './doctor-add.html',
  styleUrl: './doctor-add.css',
})
export class DoctorAdd {}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DoctorService } from '../services/doctor';
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

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
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

        nationality: ['Indian', Validators.required],

        mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],

        alternateMobileNumber: ['', Validators.pattern(/^[6-9]\d{9}$/)],

        email: ['', [Validators.required, Validators.email]],

        address: ['', Validators.required],

        city: ['', Validators.required],

        state: ['', Validators.required],

        country: ['India', Validators.required],

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

  passwordsMatch(): boolean {
    return this.doctorForm.get('password')?.value === this.doctorForm.get('confirmPassword')?.value;
  }

  registerDoctor() {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      return;
    }

    if (!this.passwordsMatch()) {
      alert('Password and Confirm Password do not match');
      return;
    }

    this.doctorService.registerDoctor(this.doctorForm.value).subscribe({
      next: (response) => {
        console.log(response);
        alert('Doctor Registered Successfully');
        this.doctorForm.reset();
      },
      error: (error) => {
        console.error(error);
        alert('Registration Failed');
      },
    });
  }
}

