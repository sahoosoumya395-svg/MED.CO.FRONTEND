import { Routes } from '@angular/router';

import { PatientRegistration } from './features/patient/patient-registration/patient-registration';
import { DoctorManagement } from './features/doctor/doctor-management/doctor-management';
import { AppointmentBooking } from './features/appointment/appointment-booking/appointment-booking';
import { DoctorDashboard } from './features/doctor/doctor-dashboard/doctor-dashboard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'appointment',
    pathMatch: 'full'
  },

  {
    path: 'patient',
    component: PatientRegistration
  },

  {
    path: 'doctor',
    component: DoctorManagement
  },

  {
    path: 'appointment',
    component: AppointmentBooking
  },

  {
    path: 'doctor-dashboard',
    component: DoctorDashboard
  },

  {
    path: '**',
    redirectTo: 'appointment'
  }

];
