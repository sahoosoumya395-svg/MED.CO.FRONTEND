import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = 'http://localhost:8082/api/patient';

  constructor(private http: HttpClient) {}

  registerPatient(patient: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, patient);
  }

  getAllPatients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }
}
