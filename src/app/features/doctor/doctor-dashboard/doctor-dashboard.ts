import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,RouterLink } from '@angular/router';
import { DoctorDashboardService } from '../../../services/doctor-dashboard';


@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './doctor-dashboard.html',
  styleUrls: ['./doctor-dashboard.css']
})
export class DoctorDashboard implements OnInit {

  // Replace this with the logged-in doctor's ID later
  doctorId!: number;

  // Doctor Information
  doctor: any = {};

  // Dashboard Cards
  todayAppointments: number = 0;
  departmentDoctors: number = 0;

  // Schedule
  schedule: any[] = [];

// Department Availability
departmentAvailability: any[] = [];







  constructor(
    private dashboardService: DoctorDashboardService,
    private cd: ChangeDetectorRef,
    private router:Router
  ) {}

  ngOnInit(): void {

  const id = localStorage.getItem('doctorId');

  if (!id) {
    console.error('Doctor ID not found');
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
    if (response == null) {
      return response;
    }
    if (response.data != null) {
      return response.data;
    }
    if (response.result != null) {
      return response.result;
    }
    return response;
  }

  // ==========================
  // Load Doctor Profile
  // ==========================
  loadDoctor(): void {

    this.dashboardService.getDoctor(this.doctorId).subscribe({

      next: (response: any) => {

        console.log('Doctor Response:', response);

        const normalizedDoctor = this.unwrapResponse(response);
        this.doctor = normalizedDoctor;

        console.log('Doctor Variable:', this.doctor);
        this.cd.detectChanges();

        // Fallback: if template interpolation did not update (observed in some reload cases),
        // write values directly into the DOM so the UI shows the loaded doctor data.
        this.updateDomWithDoctor();

        const departmentId = normalizedDoctor.departmentId ?? normalizedDoctor.department?.departmentId;

        if (departmentId != null) {
          this.dashboardService
            .getDoctorsByDepartment(departmentId)
            .subscribe({
              next: (data: any) => {
                const normalizedDoctors = this.unwrapResponse(data);
                this.departmentDoctors = Array.isArray(normalizedDoctors)
                  ? normalizedDoctors.length
                  : 0;
                this.cd.detectChanges();
                this.updateDomWithStats();
              },
              error: (err: any) => {
                console.error('Department doctors error', err);
              }
            });
        }

      },

      error: (err: any) => {
        console.error('Doctor profile error', err);
      }

    });

  }

  // Fallback DOM updater when interpolation isn't reflected in the rendered HTML
  private updateDomWithDoctor(): void {
    try {
      const root = document.querySelector('app-doctor-dashboard');
      if (!root) return;

      const setText = (selector: string, value: any) => {
        const el = root.querySelector(selector) as HTMLElement | null;
        if (el) el.textContent = (value ?? '') + '';
      };

      // Header name
      const fullName = [this.doctor.firstName, this.doctor.middleName, this.doctor.lastName]
        .filter(Boolean)
        .join(' ');
      setText('.topbar p', `Welcome back, ${fullName}`);

      // Info grid fields (match template order)
      setText('.info-grid div:nth-child(1) p', this.doctor.id);
      setText('.info-grid div:nth-child(2) p', fullName);
      setText('.info-grid div:nth-child(3) p', this.doctor.departmentName);
      setText('.info-grid div:nth-child(4) p', this.doctor.specialization);
      setText('.info-grid div:nth-child(5) p', this.doctor.email);
      setText('.info-grid div:nth-child(6) p', this.doctor.mobileNumber);

    } catch (err) {
      console.error('DOM fallback update failed', err);
    }
  }

  // ==========================
  // Today's Appointment Count
  // ==========================
  loadAppointments(): void {

    this.dashboardService.getAppointments(this.doctorId).subscribe({

      next: (response: any) => {

        const appointments = this.unwrapResponse(response);
        const appointmentsArray = Array.isArray(appointments) ? appointments : appointments ? [appointments] : [];

        // Get today's date in local timezone (YYYY-MM-DD format)
        const today = new Date();
        const todayString = today.getFullYear() + '-' +
          String(today.getMonth() + 1).padStart(2, '0') + '-' +
          String(today.getDate()).padStart(2, '0');

        console.log('Today Date:', todayString);
        console.log('All Appointments:', appointmentsArray);

        const appointmentsToday = appointmentsArray.filter(appointment => {
          try {
            if (!appointment || !appointment.appointmentDate) {
              console.warn('Appointment missing date:', appointment);
              return false;
            }
            const raw = String(appointment.appointmentDate).trim();

            // Extract just the date part (handles various formats)
            let datePart: string;
            if (raw.includes('T')) {
              // ISO format or timestamp with T
              datePart = raw.split('T')[0];
            } else if (raw.includes(' ')) {
              // Date with time (space-separated)
              datePart = raw.split(' ')[0];
            } else {
              // Already just a date
              datePart = raw;
            }

            const isToday = datePart === todayString;
            console.log(`Comparing: ${datePart} === ${todayString} => ${isToday}`);
            return isToday;
          } catch (e) {
            console.error('Date parsing error:', e, appointment);
            return false;
          }
        });

        this.todayAppointments = appointmentsToday.length;
        console.log('Today Appointments Count:', this.todayAppointments);
        this.cd.detectChanges();
        this.updateDomWithStats();

      },

      error: (err) => {
        console.error('Appointment error', err);
      }

    });

  }

  // ==========================
  // Doctor Schedule
  // ==========================
  loadSchedule(): void {

    this.dashboardService.getSchedule(this.doctorId).subscribe({

      next: (response) => {

        const scheduleResponse = this.unwrapResponse(response);
        this.schedule = Array.isArray(scheduleResponse)
          ? scheduleResponse
          : scheduleResponse ? [scheduleResponse] : [];
        this.cd.detectChanges();
        this.updateDomWithSchedule();

      },

      error: (err) => {
        console.error('Schedule error', err);
      }

    });

  }

loadDepartmentAvailability(): void {

  this.dashboardService.getDepartmentAvailability().subscribe({

    next: (res: any) => {

      this.departmentAvailability = this.unwrapResponse(res);

      console.log("Department Availability:", this.departmentAvailability);

      this.cd.detectChanges();

    },

    error: (err) => {

      console.error("Department Availability Error:", err);

    }

  });

}




  // Update cards like departmentDoctors and today's appointments directly in the DOM
  private updateDomWithStats(): void {
    try {
      const root = document.querySelector('app-doctor-dashboard');
      if (!root) return;
      const setText = (selector: string, value: any) => {
        const el = root.querySelector(selector) as HTMLElement | null;
        if (el) el.textContent = (value ?? '') + '';
      };

      setText('.cards .card:nth-child(1) h2', this.departmentDoctors);
      setText('.cards .card:nth-child(2) h2', this.todayAppointments);
    } catch (err) {
      console.error('DOM stats update failed', err);
    }
  }

  // Populate schedule table rows directly as a fallback
  private updateDomWithSchedule(): void {
    try {
      const root = document.querySelector('app-doctor-dashboard');
      if (!root) return;
      const tbody = root.querySelector('.schedule-section table tbody') as HTMLElement | null;
      if (!tbody) return;

      const rows = this.schedule.map(item => {
        const date = item.availableDate ? String(item.availableDate).split('T')[0] : '';
        const start = item.startTime ?? '';
        const end = item.endTime ?? '';
        const status = item.available ? 'Available' : 'Unavailable';
        return `<tr><td>${date}</td><td>${start}</td><td>${end}</td><td>${status}</td></tr>`;
      }).join('');

      tbody.innerHTML = rows;
    } catch (err) {
      console.error('DOM schedule update failed', err);
    }
  }


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
