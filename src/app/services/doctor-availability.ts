import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorAvailabilityService {

  private apiUrl = 'http://localhost:8082/api/doctor-availability';

  constructor(private http: HttpClient) {}

  getAvailabilityByDoctor(doctorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${doctorId}`);
  }
}
