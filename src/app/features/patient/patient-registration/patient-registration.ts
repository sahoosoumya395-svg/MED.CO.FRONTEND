import { Component } from '@angular/core';
import { FormsModule, } from '@angular/forms';
import { PatientService } from '../../../services/patient';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-patient-registration',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './patient-registration.html',
  styleUrl: './patient-registration.css'
})
export class PatientRegistration {

  patient: any = {};
  confirmPassword = '';

  constructor(private patientService: PatientService) {}

  register() {

    if (this.patient.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.patientService.registerPatient(this.patient).subscribe({
      next: (res) => {
        alert('Patient Registered Successfully');
        console.log(res);
      },
      error: (err) => {
        console.error(err);
        alert('Registration Failed');
      }
    });
  }
}
