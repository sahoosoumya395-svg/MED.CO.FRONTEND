import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  PatientService,
  PatientProfile,
  PatientApiResponse
} from '../../../core/services/patient';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.css'
})
export class PatientDashboard implements OnInit {

  isLoading = true;

  searchQuery = '';

  showProfileDropdown = false;

  patient: PatientProfile | null = null;

  loadError = false;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {

    this.isLoading = true;
    this.loadError = false;

    const email = this.authService.getUserEmail();

    console.log('Logged-in patient email:', email);

    if (!email) {

      console.error('Patient email not found');

      this.isLoading = false;

      return;
    }

    this.patientService
      .getPatientByEmail(email)
      .subscribe({

        next: (response: PatientApiResponse) => {

          console.log('Patient API response:', response);

          // API structure:
          // response.data.mrnNO
          this.patient = response.data;

          console.log('Patient data:', this.patient);

          // Check MRN specifically
         console.log('MRN:', this.patient.mrnNO);

          this.isLoading = false;

          this.cdr.detectChanges();
        },

        error: (error: any) => {

          console.error(
            'Error loading patient:',
            error
          );

          this.loadError = true;
          this.isLoading = false;

          this.cdr.detectChanges();
        }

      });
  }

  toggleProfileMenu(): void {

    this.showProfileDropdown =
      !this.showProfileDropdown;
  }

  navigateTo(path: string): void {

    this.router.navigate([path]);
  }

  logout(): void {

    localStorage.removeItem('token');

    this.router.navigate(['/login']);
  }
}
