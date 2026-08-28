import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../../services/doctor';

@Component({
  selector: 'app-doctor-management',
  standalone: true,
 imports: [
  RouterModule,
  CommonModule,
  FormsModule
],
  templateUrl: './doctor-management.html',
  styleUrl: './doctor-management.css'
})
export class DoctorManagement implements OnInit {

  totalDoctors = 0;
  availableDoctors = 0;
  onLeaveDoctors = 0;
  totalDepartments = 0;

  departments: any[] = [];
  doctors: any[] = [];

  selectedDepartmentId: number | null = null;
  showTable = false;

  constructor(
    private doctorService: DoctorService,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.loadDepartments();
  }

  private unwrapCountResponse(response: any, valueKeys: string[]): number {
    if (response == null) {
      return 0;
    }

    if (typeof response === 'number') {
      return response;
    }

    if (typeof response.data === 'number') {
      return response.data;
    }

    for (const key of valueKeys) {
      if (response[key] != null) {
        return response[key];
      }
      if (response.data?.[key] != null) {
        return response.data[key];
      }
    }

    if (typeof response.count === 'number') {
      return response.count;
    }

    return 0;
  }

  loadDashboard(): void {

    // Total Doctors
    this.doctorService.getTotalDoctors().subscribe({
      next: (data: any) => {
        console.log('Total Doctors:', data);
        this.totalDoctors = this.unwrapCountResponse(data, ['totalDoctors', 'count']);
      },
      error: (err) => {
        console.error('Total Doctors error', err);
      }
    });

    // Available Doctors
    this.doctorService.getAvailableDoctors().subscribe({
      next: (data: any) => {
        console.log('Available Doctors response:', data);
        this.ngZone.run(() => {
          this.availableDoctors = this.unwrapCountResponse(data, ['availableCount', 'availableDoctors', 'count']);
          this.cd.detectChanges();
        });
      },
      error: (err) => {
        console.error('Available Doctors error', err);
      }
    });

    // On Leave Doctors
    this.doctorService.getOnLeaveDoctors().subscribe({
      next: (data: any) => {
        console.log('On Leave Doctors response:', data);
        this.ngZone.run(() => {
          this.onLeaveDoctors = this.unwrapCountResponse(data, ['totalOnLeaveApproved', 'onLeaveCount', 'count']);
          this.cd.detectChanges();
        });
      },
      error: (err) => {
        console.error('On Leave Doctors error', err);
      }
    });

    // Total Departments
    this.doctorService.getTotalDepartments().subscribe({
      next: (data: any) => {
        console.log('Departments:', data);
        this.ngZone.run(() => {
          this.totalDepartments = this.unwrapCountResponse(data, ['totalDepartments', 'count']);
          this.cd.detectChanges();
        });
      },
      error: (err) => {
        console.error('Total Departments error', err);
      }
    });

  }

loadDepartments(): void {
  this.doctorService.getDepartments().subscribe({
    next: (data: any) => {
      this.departments = data.data ?? data;
    },
    error: (err) => {
      console.error(err);
    }
  });
}

  private normalizeDoctorList(response: any): any[] {
    const list = response?.data ?? response;
    return Array.isArray(list) ? list : [];
  }

  searchDoctors(): void {

    if (!this.selectedDepartmentId) {
      alert('Please select a department');
      return;
    }

    this.doctorService.getDoctorsByDepartment(this.selectedDepartmentId).subscribe({
      next: (data: any) => {
        this.doctors = this.normalizeDoctorList(data);
        console.log('Doctors:', this.doctors);
        this.showTable = this.doctors.length > 0;
      },
      error: (err) => {
        console.error(err);
      }
    });

}

  getDoctorStatus(doctor: any): string {
    if (!doctor) {
      return 'N/A';
    }

    if (doctor.status) {
      return doctor.status;
    }

    if (doctor.doctorStatus) {
      return doctor.doctorStatus;
    }

    if (doctor.statusName) {
      return doctor.statusName;
    }

    if (typeof doctor.available === 'boolean') {
      return doctor.available ? 'Available' : 'Unavailable';
    }

    if (typeof doctor.isAvailable === 'boolean') {
      return doctor.isAvailable ? 'Available' : 'Unavailable';
    }

    if (doctor.availability) {
      return doctor.availability;
    }

    return 'N/A';
  }

resetSearch(): void {
  this.selectedDepartmentId = null;
  this.doctors = [];
  this.showTable = false;
}






}
