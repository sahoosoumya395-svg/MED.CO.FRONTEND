import { Routes } from '@angular/router';
import { DoctorAdd } from './features/doctor/doctor-add/doctor-add';

// Public & Auth Pages
import { LandingPage } from './features/landing-page/landing-page';
import { AboutUs } from './features/about-us/about-us';
import { PreRegister } from './features/pre-register/pre-register';
import { ContactUs } from './features/contact-us/contact-us';
import { Services } from './features/services/services';
import { Language } from './features/language/language';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';
import { ResetPassword } from './features/auth/reset-password/reset-password';
import { ResetPasswordSuccess } from './features/auth/reset-password-success/reset-password-success';

// Billing, Medicine, Reports, Profile, Settings
import { Billing } from './features/billing/billing';
import { FinalBill } from './features/final-bill/final-bill';
import { Medicine } from './features/medicine/medicine';
import { Reports } from './features/reports/reports';
import { Profile } from './features/profile/profile';
import { Settings } from './features/settings/settings';

// Patient & Doctor Management
import { PatientRegistration } from './features/patient/patient-registration/patient-registration';
import { DoctorManagement } from './features/doctor/doctor-management/doctor-management';
import { AppointmentBooking } from './features/appointment/appointment-booking/appointment-booking';
import { DoctorDashboard } from './features/doctor/doctor-dashboard/doctor-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'doctor/add', pathMatch: 'full' },

  { path: 'doctor/add', component: DoctorAdd },

  // Public
  { path: 'about-us', component: AboutUs },
  { path: 'pre-register', component: PreRegister },
  { path: 'contact-us', component: ContactUs },
  { path: 'services', component: Services },
  { path: 'language', component: Language },

  // Authentication
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword },
  { path: 'reset-password-success', component: ResetPasswordSuccess },

  // Main Features
  { path: 'patient', component: PatientRegistration },
  { path: 'doctor', component: DoctorManagement },
  { path: 'appointment', component: AppointmentBooking },
  { path: 'doctor-dashboard', component: DoctorDashboard },

  // Other Modules
  { path: 'billing', component: Billing },
  { path: 'final-bill', component: FinalBill },
  { path: 'medicine', component: Medicine },
  { path: 'reports', component: Reports },
  { path: 'profile', component: Profile },
  { path: 'settings', component: Settings },

  // Fallback
  { path: '**', redirectTo: 'login' },
];
