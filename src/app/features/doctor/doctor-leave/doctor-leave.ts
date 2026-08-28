import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../../services/doctor';

@Component({
  selector: 'app-doctor-leave',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-leave.html',
  styleUrl: './doctor-leave.css',
})
export class DoctorLeave {

  doctorId!: number;
  doctorName = '';
  departmentName = '';

  leave = {
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: ''
  };

  constructor(private doctorService: DoctorService) {}

  loadDoctor() {

    if (!this.doctorId) {
      return;
    }

    this.doctorService.getDoctorById(this.doctorId).subscribe({

      next: (data: any) => {

  this.doctorName =
    `${data.firstName} ${data.middleName ?? ''} ${data.lastName}`.trim();

  this.departmentName = data.departmentName;

},

      error: () => {
        alert('Doctor not found');
        this.doctorName = '';
        this.departmentName = '';
      }

    });

  }


  submitLeave() {

  const request = {
    doctorId: this.doctorId,
    leaveType: this.leave.leaveType,
    fromDate: this.leave.fromDate,
    toDate: this.leave.toDate,
    reason: this.leave.reason
  };

  this.doctorService.applyLeave(request).subscribe({

    next: () => {

      alert('Leave applied successfully.');

      this.leave = {
        leaveType: '',
        fromDate: '',
        toDate: '',
        reason: ''
      };

    },

    error: (err) => {

      console.error(err);
      alert('Failed to apply leave.');

    }

  });

}

}
