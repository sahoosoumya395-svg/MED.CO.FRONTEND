import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PatientProfile {
  patientId:       number;
  firstName:       string;
  middleName:      string;
  lastName:        string;
  gender:          string;
  dateOfBirth:     string;
  bloodGroup:      string;
  nationality:     string;
  profilePhoto:    string | null;
  mobileNumber:    string;
  alternateNumber: string;
  address:         string;
  city:            string;
  state:           string;
  country:         string;
  pinCode:         string;
  height:          number;
  weight:          number;
  mrnNO:           string;   // exact API field name (capital N and O)
  visionStatus:    string;
  hearingStatus:   string;
  bodyTemperature: number;
}

export interface PatientApiResponse {
  statusCode: number;
  message:    string;
  data:       PatientProfile;
}

@Injectable({ providedIn: 'root' })
export class PatientService {

  private readonly apiUrl = 'http://localhost:8082/api/patient';

  constructor(private http: HttpClient) {}

  /**
   * GET /api/patient/email/{email}
   * Returns: { statusCode, message, data: PatientProfile }
   */
  getPatientByEmail(email: string): Observable<PatientApiResponse> {
    return this.http.get<PatientApiResponse>(
      `${this.apiUrl}/email/${encodeURIComponent(email)}`
    );
  }

  /**
   * GET /api/patient/{id}
   * Returns: { statusCode, message, data: PatientProfile }
   */
  getPatientDashboardData(patientId: number): Observable<PatientApiResponse> {
    return this.http.get<PatientApiResponse>(
      `${this.apiUrl}/${patientId}`
    );
  }
}
