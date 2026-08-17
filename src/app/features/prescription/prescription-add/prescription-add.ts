import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


import {
  PrescriptionRequest,
  PrescriptionResponse
} from '../../../models/prescription.model';

import {
  PrescriptionService,
  
} from '../../../services/prescription';

@Component({
  selector: 'app-prescription-add',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './prescription-add.html',
  styleUrl: './prescription-add.css',
})
export class PrescriptionAdd implements OnInit {

  // ===========================
  // Patient Details
  // ===========================
  patientName = '';
  age = '';
  address = '';
  mrnNo = '';
  date = new Date().toISOString().split('T')[0];

  // ===========================
  // Doctor Details
  // ===========================
  doctorName = '';
  specialization = '';
  hospitalName = 'MED.Co';
  hospitalAddress = '';

  // ===========================
  // Prescription Details
  // ===========================
  appointmentId!: number;

  diagnosis = '';
  medicines = '';
  advice = '';

  // HTML returned by backend
  prescriptionHtml = '';

  constructor(
    private route: ActivatedRoute,
    private prescriptionService: PrescriptionService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('appointmentId');

    if (id) {
      this.appointmentId = Number(id);
      console.log('Appointment ID:', this.appointmentId);
    } else {
      alert('Appointment ID not found.');
    }
  }

  savePrescription(): void {

    if (!this.diagnosis.trim()) {
      alert('Diagnosis is required.');
      return;
    }

    if (!this.medicines.trim()) {
      alert('Medicines are required.');
      return;
    }

    if (!this.advice.trim()) {
      alert('Advice is required.');
      return;
    }

    const request: PrescriptionRequest = {
      appointmentId: this.appointmentId,
      diagnosis: this.diagnosis,
      medicines: this.medicines,
      advice: this.advice,
    };

    this.prescriptionService.createPrescription(request).subscribe({

      next: (response) => {

        console.log('Prescription Saved Successfully', response);

        // Save HTML returned by backend
        this.prescriptionHtml = response.prescriptionHtml;

        alert('Prescription Saved Successfully');

        // Optional: Clear the form
        this.diagnosis = '';
        this.medicines = '';
        this.advice = '';

      },

      error: (error) => {

        console.error(error);

        if (error.error?.message) {
          alert(error.error.message);
        } else {
          alert('Unable to save prescription.');
        }

      }

    });

  }

  printPrescription(): void {

    if (!this.prescriptionHtml) {
      alert('Please save the prescription first.');
      return;
    }

    const printWindow = window.open('', '_blank');

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(this.prescriptionHtml);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }

  }

}