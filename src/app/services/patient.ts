import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PatientProfile {
  patientId: number;

  firstName: string;
  middleName?: string;
  lastName: string;

  gender: string;

  bloodGroup: string;

  height: number;
  weight: number;

  // IMPORTANT: Backend returns mrnNO
 mrnNO: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;

  mobileNumber?: string;
  alternateNumber?: string;

  dateOfBirth?: string;

  nationality?: string;

  bodyTemperature?: number;

  hearingStatus?: string;
  visionStatus?: string;

  profilePhoto?: string | null;
}

export interface PatientApiResponse {
  data: PatientProfile;
  message: string;
  statusCode: number;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = 'http://localhost:8082/api/patient';

  constructor(private http: HttpClient) {}

  registerPatient(patient: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/register`,
      patient
    );
  }

  getAllPatients(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'patientId',
    direction: string = 'asc'
  ): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/all?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
    );
  }

  getPatientById(patientId: number): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/${patientId}`
    );
  }

  getPatientByEmail(
    email: string
  ): Observable<PatientApiResponse> {

    return this.http.get<PatientApiResponse>(
      `${this.apiUrl}/email/${encodeURIComponent(email)}`
    );
  }

  getPatientByMrn(
    mrnNo: string
  ): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/mrn/${mrnNo}`
    );
  }

  getPatientCount(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/count`
    );
  }

  updatePatient(
    patientId: number,
    patient: any
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/update/${patientId}`,
      patient
    );
  }

  deletePatient(
    patientId: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/delete/${patientId}`
    );
  }
}
