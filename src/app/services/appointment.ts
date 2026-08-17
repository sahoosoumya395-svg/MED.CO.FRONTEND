import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = 'http://localhost:8082/api/appointments';

  constructor(private http: HttpClient) {}

  bookAppointment(appointment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/book`, appointment);
  }

  getAppointmentById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${id}`);
  }

  cancelAppointment(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/cancel/${id}`, {});
  }

  getDoctorAppointments(doctorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/doctor/get/${doctorId}`);
  }

  getPatientAppointments(patientId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/patient/get/${patientId}`);
  }

  getAvailableDates(doctorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/available-dates/get/${doctorId}`);
  }

  getAvailableSlots(doctorId: number, appointmentDate: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/available-slots/get?doctorId=${doctorId}&appointmentDate=${appointmentDate}`
    );
  }

getPatientByMrn(mrnNo: string): Observable<any> {
  return this.http.get(`http://localhost:8082/api/patient/mrn/${mrnNo}`);
}





}
