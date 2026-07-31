import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {

  private apiUrl = 'http://localhost:8082/api/doctors';

  constructor(private http: HttpClient) {}

  registerDoctor(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

}