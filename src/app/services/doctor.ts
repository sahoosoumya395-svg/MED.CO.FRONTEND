import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private apiUrl = 'http://localhost:8082/api/doctors';

  constructor(private http: HttpClient) {}

  getDoctorsByDepartment(departmentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/department/${departmentId}`);
  }

}
