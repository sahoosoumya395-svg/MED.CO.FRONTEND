import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Appointment {
  private apiUrl = 'http://localhost:8082/api/appointments';

  constructor(private http: HttpClient) {}

  getAppointmentsTodayCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/today`);
  }
}
