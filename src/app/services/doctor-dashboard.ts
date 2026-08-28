import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorDashboardService {

  private api = 'http://localhost:8082/api';

  constructor(private http: HttpClient) {}

  getDoctor(id: number): Observable<any> {
    return this.http.get(`${this.api}/doctors/${id}`);
  }

  getAppointments(id: number): Observable<any> {
    return this.http.get(`${this.api}/appointments/doctor/get/${id}`);
  }

  getDoctorsByDepartment(id: number): Observable<any> {
    return this.http.get(`${this.api}/doctors/department/${id}`);
  }

  getSchedule(id: number): Observable<any> {
    return this.http.get(`${this.api}/doctor-availability/get/${id}`);
  }
  logout(): Observable<any> {
  return this.http.post(`${this.api}/auth/logout`, {});
}
getDepartmentAvailability(): Observable<any> {
  return this.http.get(`${this.api}/departments/availability`);
}

}
