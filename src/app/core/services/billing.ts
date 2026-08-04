import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Billing {
  private apiUrl = 'http://localhost:8082/api/billing';

  constructor(private http: HttpClient) {}

  createInvoice(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create/invoice`, payload);
  }
}
