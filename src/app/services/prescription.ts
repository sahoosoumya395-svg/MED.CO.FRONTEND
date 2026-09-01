import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PrescriptionRequest,
  PrescriptionResponse
} from  '../models/prescription.model';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  private apiUrl = 'http://localhost:8082/api/prescriptions';

  constructor(private http: HttpClient) {}

  createPrescription(
    prescription: PrescriptionRequest
  ): Observable<PrescriptionResponse> {
    return this.http.post<PrescriptionResponse>(
      this.apiUrl,
      prescription
    );
  }

  getPrescription(id: number): Observable<PrescriptionResponse> {
    return this.http.get<PrescriptionResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  getByAppointment(id: number): Observable<PrescriptionResponse> {
    return this.http.get<PrescriptionResponse>(
      `${this.apiUrl}/appointment/${id}`
    );
  }
}