export interface PrescriptionRequest {
  appointmentId: number;
  diagnosis: string;
  medicines: string;
  advice: string;
}

export interface PrescriptionResponse {
  prescriptionId: number;
  diagnosis: string;
  medicines: string;
  advice: string;
  prescriptionHtml: string;
} 