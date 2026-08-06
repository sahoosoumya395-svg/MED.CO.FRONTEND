import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

export interface InvoiceRecord {
  invoiceNumber: string;
  invoiceId: string;
  date: string;
  totalAmount: string;
  billCreatedAt: string;
  patientName?: string;
}

@Component({
  selector: 'app-patient-billing-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './patient-billing-details.html',
  styleUrls: ['./patient-billing-details.css']
})
export class PatientBillingDetails implements OnInit {

  // Patient name search query
  patientNameSearch: string = 'John Doe';
  activeSearchQuery: string = 'John Doe';
  isLoading: boolean = false;

  // Header user info
  userName: string = 'John Doe';
  userRole: string = 'Patient';
  userAvatar: string = 'https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg';

  // Dummy Invoice Records matching the mockup screenshot exactly
  dummyInvoices: InvoiceRecord[] = [
    {
      invoiceNumber: 'INV-1001',
      invoiceId: 'BILL-000101',
      date: '10 Jul 2026',
      totalAmount: '₹800',
      billCreatedAt: '2026-07-10 09:15:22.000000',
      patientName: 'John Doe'
    },
    {
      invoiceNumber: 'INV-1002',
      invoiceId: 'BILL-000102',
      date: '10 Jul 2026',
      totalAmount: '₹1,500',
      billCreatedAt: '2026-07-10 09:16:45.000000',
      patientName: 'John Doe'
    },
    {
      invoiceNumber: 'INV-1003',
      invoiceId: 'BILL-000103',
      date: '12 Jul 2026',
      totalAmount: '₹2,000',
      billCreatedAt: '2026-07-12 11:25:30.000000',
      patientName: 'John Doe'
    },
    {
      invoiceNumber: 'INV-1004',
      invoiceId: 'BILL-000104',
      date: '20 Jul 2026',
      totalAmount: '₹1,200',
      billCreatedAt: '2026-07-20 10:45:12.000000',
      patientName: 'John Doe'
    },
    {
      invoiceNumber: 'INV-1005',
      invoiceId: 'BILL-000105',
      date: '25 Jul 2026',
      totalAmount: '₹1,000',
      billCreatedAt: '2026-07-25 03:30:55.000000',
      patientName: 'John Doe'
    }
  ];

  // Active invoices list displayed on screen
  invoices: InvoiceRecord[] = this.dummyInvoices;

  private readonly apiUrl = '/api/patient/billing-details';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchBillingDetails();
  }

  onSearchClick(): void {
    this.activeSearchQuery = this.patientNameSearch;
    this.fetchBillingDetails();
  }

  /**
   * Fetch billing details from Backend API.
   * Uses catchError fallback to dummyInvoices so that:
   * 1. Before API integration: Renders exact mockup data.
   * 2. After API integration: Automatically displays backend response body data.
   */
  fetchBillingDetails(): void {
    this.isLoading = true;

    const endpoint = this.activeSearchQuery
      ? `${this.apiUrl}?patientName=${encodeURIComponent(this.activeSearchQuery)}`
      : this.apiUrl;

    this.http.get<InvoiceRecord[]>(endpoint).pipe(
      catchError(err => {
        console.log('Backend API endpoint not yet connected. Displaying mockup dummy billing data.');
        return of(this.dummyInvoices);
      })
    ).subscribe(data => {
      this.isLoading = false;
      if (data && data.length > 0) {
        this.invoices = data;
      } else {
        this.invoices = this.dummyInvoices;
      }
    });
  }

  /**
   * Filter invoices by patient name search query
   */
  get filteredInvoices(): InvoiceRecord[] {
    if (!this.activeSearchQuery.trim()) {
      return this.invoices;
    }
    const query = this.activeSearchQuery.toLowerCase().trim();
    return this.invoices.filter(inv =>
      !inv.patientName || inv.patientName.toLowerCase().includes(query)
    );
  }

  onSearchChange(): void {
    // Local filter or API search trigger
  }

  goBackToDashboard(): void {
    this.router.navigate(['/patient-dashboard']);
  }
}
