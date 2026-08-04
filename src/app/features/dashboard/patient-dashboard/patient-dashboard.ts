import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatientService, PatientDashboardData } from '../../../core/services/patient';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.css',
})
export class PatientDashboard implements OnInit {
  isLoading = true;
  searchQuery = '';
  showNotificationsDropdown = false;
  showProfileDropdown = false;

  dashboardData: PatientDashboardData = {
    patientName: 'John Doe',
    role: 'Patient',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    unreadNotificationsCount: 3,
    stats: {
      totalAppointments: 12,
      upcomingAppointments: 2,
      doctorsConsulted: 3,
      healthScore: 85,
      healthScoreStatus: 'Good'
    },
    healthOverview: {
      bloodGroup: 'O+',
      height: '175 cm',
      weight: '70 kg',
      hydrationTip: 'Stay hydrated! Drink at least 8 glasses of water daily.'
    },
    dailyTip: {
      title: 'Daily Health Tip',
      quoteHeader: 'A healthy outside starts from the inside.',
      quoteSub: 'Eat healthy, stay active and keep smiling!'
    }
  };

  notifications = [
    { title: 'Appointment Confirmed', time: '10 mins ago', read: false },
    { title: 'Prescription Updated by Dr. Smith', time: '1 hour ago', read: false },
    { title: 'Lab Results Ready', time: 'Yesterday', read: false }
  ];

  constructor(
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.isLoading = true;
    this.patientService.getPatientDashboardData().subscribe({
      next: (data) => {
        if (data) {
          this.dashboardData = data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading patient dashboard data', err);
        this.isLoading = false;
      }
    });
  }

  toggleNotifications(): void {
    this.showNotificationsDropdown = !this.showNotificationsDropdown;
    this.showProfileDropdown = false;
  }

  toggleProfileMenu(): void {
    this.showProfileDropdown = !this.showProfileDropdown;
    this.showNotificationsDropdown = false;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    // Perform logout actions
    this.router.navigate(['/login']);
  }
}
