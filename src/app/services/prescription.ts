import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PrescriptionRequest {
  appointmentId: number;
  diagnosis: string;
  medicines: string;
  advice: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  private apiUrl = 'http://localhost:8080/api/prescriptions';

  constructor(private http: HttpClient) { }

  createPrescription(request: PrescriptionRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, request);
  }
}