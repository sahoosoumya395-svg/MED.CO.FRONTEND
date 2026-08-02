import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {

  constructor(private http?: HttpClient) {}

  registerDoctor(data: any): Observable<any> {
    return of({
      status: true,
      message: 'Doctor Registered Successfully (Mock Mode)',
      data
    });
  }

}