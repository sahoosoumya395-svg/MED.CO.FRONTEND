import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DoctorDashboardService } from '../../../services/doctor-dashboard';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './doctor-dashboard.html',
  styleUrls: ['./doctor-dashboard.css']
})
export class DoctorDashboard implements OnInit {

  doctorId!: number;
  doctor: any = {};
  todayAppointments: number = 0;
  departmentDoctors: number = 0;
  schedule: any[] = [];
  departmentAvailability: any[] = [];

  constructor(
    private dashboardService: DoctorDashboardService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = localStorage.getItem('doctorId');
    if (!id) {
      console.error('Doctor ID not found in localStorage');
      return;
    }
    this.doctorId = Number(id);
    console.log('Logged in Doctor ID:', this.doctorId);
    this.loadDoctor();
    this.loadAppointments();
    this.loadSchedule();
    this.loadDepartmentAvailability();
  }

  private unwrapResponse(response: any): any {
    if (response == null) return response;
    if (response.data != null) return response.data;
    if (response.result != null) return response.result;
    return response;
  }

  // ==========================
  // Load Doctor Profile
  // ==========================
  loadDoctor(): void {
    this.dashboardService.getDoctor(this.doctorId).subscribe({
      next: (response: any) => {
        console.log('Doctor Response:', response);
        this.doctor = this.unwrapResponse(response);
        console.log('Doctor Variable:', this.doctor);
        this.cd.detectChanges();

        const departmentId =
          this.doctor.departmentId ??
          this.doctor.department?.departmentId;

        if (departmentId != null) {
          this.dashboardService
            .getDoctorsByDepartment(departmentId)
            .subscribe({
              next: (data: any) => {
                const list = this.unwrapResponse(data);
                this.departmentDoctors = Array.isArray(list) ? list.length : 0;
                this.cd.detectChanges();
              },
              error: (err: any) => console.error('Department doctors error', err)
            });
        }
      },
      error: (err: any) => console.error('Doctor profile error', err)
    });
  }

  // ==========================
  // Today's Appointment Count
  // ==========================
  loadAppointments(): void {
    this.dashboardService.getAppointments(this.doctorId).subscribe({
      next: (response: any) => {
        const appointments = this.unwrapResponse(response);
        const list = Array.isArray(appointments) ? appointments : appointments ? [appointments] : [];

        const today = new Date();
        const todayString =
          today.getFullYear() + '-' +
          String(today.getMonth() + 1).padStart(2, '0') + '-' +
          String(today.getDate()).padStart(2, '0');

        this.todayAppointments = list.filter(a => {
          if (!a?.appointmentDate) return false;
          const raw = String(a.appointmentDate).trim();
          const datePart = raw.includes('T')
            ? raw.split('T')[0]
            : raw.includes(' ') ? raw.split(' ')[0] : raw;
          return datePart === todayString;
        }).length;

        console.log('Today Appointments:', this.todayAppointments);
        this.cd.detectChanges();
      },
      error: (err) => console.error('Appointment error', err)
    });
  }

  // ==========================
  // Doctor Schedule
  // ==========================
  loadSchedule(): void {
    this.dashboardService.getSchedule(this.doctorId).subscribe({
      next: (response) => {
        const data = this.unwrapResponse(response);
        this.schedule = Array.isArray(data) ? data : data ? [data] : [];
        this.cd.detectChanges();
      },
      error: (err) => console.error('Schedule error', err)
    });
  }

  // ==========================
  // Department Availability
  // ==========================
  loadDepartmentAvailability(): void {
    this.dashboardService.getDepartmentAvailability().subscribe({
      next: (res: any) => {
        this.departmentAvailability = this.unwrapResponse(res) ?? [];
        console.log('Department Availability:', this.departmentAvailability);
        this.cd.detectChanges();
      },
      error: (err) => console.error('Department Availability Error:', err)
    });
  }

  // ==========================
  // Logout
  // ==========================
  logout(): void {
    this.dashboardService.logout().subscribe({
      next: () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}
