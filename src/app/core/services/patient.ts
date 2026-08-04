import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface PatientDashboardData {
  patientName: string;
  role: string;
  avatarUrl: string;
  unreadNotificationsCount: number;
  stats: {
    totalAppointments: number;
    upcomingAppointments: number;
    doctorsConsulted: number;
    healthScore: number;
    healthScoreStatus: string;
  };
  healthOverview: {
    bloodGroup: string;
    height: string;
    weight: string;
    hydrationTip: string;
  };
  dailyTip: {
    title: string;
    quoteHeader: string;
    quoteSub: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = '/api/patient';

  private dummyDashboardData: PatientDashboardData = {
    patientName: 'John Doe',
    role: 'Patient',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    unreadNotificationsCount: 3,
    stats: {
      totalAppointments: 12,
      upcomingAppointments: 2,
      doctorsConsulted: 3,
      healthScore: 85,
      healthScoreStatus: 'Good'
    },
    healthOverview: {
      bloodGroup: 'O+',
      height: '175 cm',
      weight: '70 kg',
      hydrationTip: 'Stay hydrated! Drink at least 8 glasses of water daily.'
    },
    dailyTip: {
      title: 'Daily Health Tip',
      quoteHeader: 'A healthy outside starts from the inside.',
      quoteSub: 'Eat healthy, stay active and keep smiling!'
    }
  };

  constructor(private http: HttpClient) {}

  getPatientDashboardData(patientId?: string): Observable<PatientDashboardData> {
    const url = `${this.apiUrl}/dashboard${patientId ? '?patientId=' + patientId : ''}`;
    return this.http.get<PatientDashboardData>(url).pipe(
      catchError(() => {
        // Fallback to dummy data before API is integrated
        return of(this.dummyDashboardData);
      })
    );
  }
}

// Alias for backwards compatibility
export { PatientService as Patient };
