import { Medicine } from './medicine.model';

export interface Billing {

  invoiceNumber: string;

  invoiceDate: string;

  patientId: string;

  patientName: string;

  doctorName: string;

  specialization: string;

  doctorFee: number;

  medicines: Medicine[];

  medicineTotal: number;

  serviceCharge: number;

  tax: number;

  totalAmount: number;

}