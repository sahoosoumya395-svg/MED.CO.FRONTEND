import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private apiUrl = 'http://localhost:8082/api/departments';

  constructor(private http: HttpClient) {}

  getAllDepartments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAll`);
  }
}
