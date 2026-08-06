import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private doctorApi = 'http://localhost:8082/api/doctors';
  private availabilityApi = 'http://localhost:8082/api/doctor-availability';
  private leaveApi = 'http://localhost:8082/api/doctor-leaves';
  private departmentApi = 'http://localhost:8082/api/departments';

  constructor(private http: HttpClient) {}

  // Appointment Booking
  getDoctorsByDepartment(departmentId: number): Observable<any> {
    return this.http.get(`${this.doctorApi}/department/${departmentId}`);
  }

  // Dashboard
  getTotalDoctors(): Observable<any> {
    return this.http.get(`${this.doctorApi}/count`);
  }

  getAvailableDoctors(): Observable<any> {
    return this.http.get(`${this.availabilityApi}/available/count`);
  }

  getOnLeaveDoctors(): Observable<any> {
    return this.http.get(`${this.leaveApi}/all-leave/count/date-wise`);
  }

  getTotalDepartments(): Observable<any> {
    return this.http.get(`${this.departmentApi}/count`);
  }
  getDepartments(): Observable<any> {
  return this.http.get(`${this.departmentApi}/getAll`);
}

  // Doctor List
  getAllDoctors(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.doctorApi}?page=${page}&size=${size}`);
  }

// Get Doctor by ID
getDoctorById(id: number): Observable<any> {
  return this.http.get(`${this.doctorApi}/${id}`);
}
applyLeave(data: any): Observable<any> {
  return this.http.post(`${this.leaveApi}/apply`, data);
}


}
