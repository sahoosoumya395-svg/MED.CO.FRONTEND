

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Billing as BillingService } from '../../core/services/billing';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './billing.html',
  styleUrls: ['./billing.css']
})
export class Billing implements OnInit {

  billingForm!: FormGroup;
  private lastAddMedicineClick = 0;
  
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private billingService: BillingService
  ) { }

  logout(): void {
    console.log("Logging out...");
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    this.initializeForm();
    this.addMedicine();
  }

  /**
   * Initialize Billing Form
   */
  initializeForm(): void {

    this.billingForm = this.fb.group({

      invoiceNumber: [
        {
          value: '',
          disabled: true
        }
      ],

      invoiceDate: [
        new Date().toISOString().substring(0, 10),
        Validators.required
      ],

      patientId: ['', Validators.required],

      patientName: ['', Validators.required],

      doctorName: ['', Validators.required],

      specialization: ['', Validators.required],

      doctorFee: [
        '',
        [Validators.required, Validators.min(0)]
      ],

      serviceCharge: [
        0,
        [Validators.required, Validators.min(0)]
      ],

      tax: [
        0,
        [Validators.required, Validators.min(0)]
      ],

      medicines: this.fb.array([])
    });

    this.billingForm.valueChanges.subscribe(() => {
      this.calculateSummary();
    });

  }

  /**
   * Clear or select text on input focus
   */
  clearInputOnFocus(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      if (input.value === '0' || input.value === '1') {
        input.value = '';
      }
      input.select();
    }
  }

  /**
   * Medicine FormArray
   */
  get medicines(): FormArray {
    return this.billingForm.get('medicines') as FormArray;
  }

  /**
   * Create Medicine Row
   */
  createMedicine(): FormGroup {

    const medicine = this.fb.group({

      medicineName: ['', Validators.required],

      quantity: [
        '',
        [Validators.required, Validators.min(0)]
      ],

      unitPrice: [
        '',
        [Validators.required, Validators.min(0)]
      ]

    });

    medicine.valueChanges.subscribe(() => {
      this.calculateMedicineTotal(medicine);
      this.calculateSummary();
    });

    return medicine;

  }

  /**
   * Add Medicine
   */
  addMedicine(): void {
    this.medicines.push(this.createMedicine());
  }

  /**
   * Handle add button clicks safely.
   */
  onAddMedicine(): void {
    const now = Date.now();

    if (now - this.lastAddMedicineClick < 250) {
      return;
    }

    this.lastAddMedicineClick = now;
    this.addMedicine();
  }

  /**
   * Remove Medicine
   */
  removeMedicine(index: number): void {

    if (this.medicines.length > 1) {
      this.medicines.removeAt(index);
      this.calculateSummary();
    }

  }

  /**
   * Calculate Single Medicine Total
   */
  calculateMedicineTotal(medicine: FormGroup): void {

    const quantity =
      Number(medicine.get('quantity')?.value);

    const unitPrice =
      Number(medicine.get('unitPrice')?.value);

    const total = quantity * unitPrice;

    medicine.get('total')
      ?.setValue(total, { emitEvent: false });

  }

  /**
   * Medicine Total
   */
  getMedicineTotal(): number {

    let total = 0;

    this.medicines.controls.forEach(control => {
      const quantity = Number(control.get('quantity')?.value || 0);
      const unitPrice = Number(control.get('unitPrice')?.value || 0);
      total += quantity * unitPrice;
    });

    return total;

  }

  /**
   * Grand Total
   */
  getGrandTotal(): number {

    const doctorFee =
      Number(this.billingForm.get('doctorFee')?.value);

    const serviceCharge =
      Number(this.billingForm.get('serviceCharge')?.value);

    const tax =
      Number(this.billingForm.get('tax')?.value);

    return doctorFee +
      serviceCharge +
      tax +
      this.getMedicineTotal();

  }

  /**
   * Refresh Summary
   */
  calculateSummary(): void {

    // Trigger change detection only.
    this.getMedicineTotal();
    this.getGrandTotal();

  }

  /**
   * Generate Invoice
   */
  generateInvoice(): void {

    if (this.billingForm.invalid) {

      this.billingForm.markAllAsTouched();

      return;

    }

    const rawData = this.billingForm.getRawValue();
    const payload = {
      patientId: Number(rawData.patientId),
      patientName: rawData.patientName,
      invoiceDate: rawData.invoiceDate,
      doctorConsultation: {
        doctorName: rawData.doctorName,
        specialization: rawData.specialization,
        doctorFee: Number(rawData.doctorFee || 0)
      },
      medicines: (rawData.medicines || [])
        .filter((m: any) => m && m.medicineName && m.medicineName.trim() !== '')
        .map((m: any) => ({
          medicineName: m.medicineName,
          quantity: Number(m.quantity || 1),
          unitPrice: Number(m.unitPrice || 0)
        }))
    };

    console.log('Sending final bill payload:', payload);
    this.isLoading = true;
    this.errorMessage = '';

    this.billingService.createInvoice(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        console.log('Invoice generation success:', res);
        
        // Pass the actual backend response (res.data) to the final-bill page
        if (res && res.data) {
          this.router.navigate(['/final-bill'], { state: { invoiceData: res.data } });
        } else {
           this.errorMessage = 'Generated invoice details missing from server.';
           alert(this.errorMessage);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Invoice generation failed:', err);
        this.errorMessage = err.error?.message || 'Failed to generate invoice. Please check the inputs.';
        alert(this.errorMessage);
      }
    });

  }

}


