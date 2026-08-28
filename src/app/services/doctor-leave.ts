import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DoctorLeave {
  leaveId: number;
  doctorId: number;
  doctorName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorLeaveService {

  private apiUrl = 'http://localhost:8082/api/doctor-leaves';

  constructor(private http: HttpClient) {}

  // Get all leave requests
  getAllLeaves(): Observable<DoctorLeave[]> {
    return this.http.get<DoctorLeave[]>(
      `${this.apiUrl}/view/all`
    );
  }

  // Get leave by ID
  getLeaveById(leaveId: number): Observable<DoctorLeave> {
    return this.http.get<DoctorLeave>(
      `${this.apiUrl}/view/${leaveId}`
    );
  }

  // Accept / Reject leave
  updateLeaveStatus(
    leaveId: number,
    status: string
  ): Observable<DoctorLeave> {

    return this.http.put<DoctorLeave>(
      `${this.apiUrl}/admin/${leaveId}/status`,
      {
        status: status
      }
    );
  }

  // Delete leave
  deleteLeave(leaveId: number): Observable<string> {
    return this.http.delete(
      `${this.apiUrl}/delete/${leaveId}`,
      {
        responseType: 'text'
      }
    );
  }
}
