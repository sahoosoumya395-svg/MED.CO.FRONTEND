import { Component, OnInit, Inject, PLATFORM_ID, Input } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

export interface MedicineItem {
  medicineName: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceData {
  invoiceNumber?: string;
  invoiceDate?: string;
  patientId?: string;
  patientName?: string;
  doctorName?: string;
  specialization?: string;
  doctorFee?: number;
  serviceCharge?: number;
  tax?: number;
  medicines?: MedicineItem[];
}

@Component({
  selector: 'app-final-bill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './final-bill.html',
  styleUrl: './final-bill.css'
})
export class FinalBill implements OnInit {

  @Input() set billData(data: any) {
    if (data) {
      this.populateData(data);
    }
  }

  invoice: InvoiceData = {
    invoiceNumber: '',
    invoiceDate: '',
    patientId: '',
    patientName: '',
    doctorName: '',
    specialization: '',
    doctorFee: 0,
    serviceCharge: 0,
    tax: 0,
    medicines: []
  };

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['invoiceData']) {
      this.populateData(navigation.extras.state['invoiceData']);
    } else if (isPlatformBrowser(this.platformId) && typeof history !== 'undefined' && history.state?.['invoiceData']) {
      this.populateData(history.state['invoiceData']);
    }
  }

  ngOnInit(): void {}

  public populateData(data: any): void {
    if (!data) return;

    // Handle both Angular Form data and Spring Boot REST API DTO formats (camelCase & snake_case)
    const patientId = data.patientId || data.patient_id || data.patientCode || '';
    const patientName = data.patientName || data.patient_name || data.name || '';
    const doctorName = data.doctorName || data.doctor_name || '';
    const specialization = data.specialization || data.doctor_specialization || data.dept || '';
    const invoiceNumber = data.invoiceNumber || data.invoice_number || data.invoiceNo || '';
    const invoiceDate = data.invoiceDate || data.invoice_date || data.date || '';

    const doctorFee = parseFloat(data.doctorFee || data.doctor_fee || 0) || 0;
    const serviceCharge = parseFloat(data.serviceCharge || data.service_charge || 0) || 0;
    const tax = parseFloat(data.tax || data.tax_amount || 0) || 0;

    const rawMedicines = data.medicines || data.medicineList || data.items || [];
    const medicines: MedicineItem[] = rawMedicines
      .filter((m: any) => m && (m.medicineName || m.medicine_name || m.name))
      .map((m: any) => ({
        medicineName: m.medicineName || m.medicine_name || m.name || '',
        quantity: parseFloat(m.quantity || m.qty || 0) || 0,
        unitPrice: parseFloat(m.unitPrice || m.unit_price || m.price || 0) || 0
      }));

    this.invoice = {
      invoiceNumber,
      invoiceDate,
      patientId,
      patientName,
      doctorName,
      specialization,
      doctorFee,
      serviceCharge,
      tax,
      medicines
    };
  }

  getMedicineRowTotal(medicine: MedicineItem): number {
    return Number(medicine.quantity || 0) * Number(medicine.unitPrice || 0);
  }

  getMedicineTotal(): number {
    return (this.invoice.medicines || []).reduce((acc, item) => {
      return acc + (Number(item.quantity || 0) * Number(item.unitPrice || 0));
    }, 0);
  }

  getGrandTotal(): number {
    return Number(this.invoice.doctorFee || 0) +
           Number(this.invoice.serviceCharge || 0) +
           Number(this.invoice.tax || 0) +
           this.getMedicineTotal();
  }

  printInvoice(): void {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
      window.print();
    }
  }

  goBack(): void {
    this.router.navigate(['/billing']);
  }

}
