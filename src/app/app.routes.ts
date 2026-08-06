import { Routes } from '@angular/router';

// Prescription
import { PrescriptionAdd } from './features/prescription/prescription-add/prescription-add';

// Doctor
import { DoctorLeave } from './features/doctor/doctor-leave/doctor-leave';
import { DoctorLeaveRequest } from './features/doctor/doctor-leave-request/doctor-leave-request';
import { DoctorAdd } from './features/doctor/doctor-add/doctor-add';
import { DoctorManagement } from './features/doctor/doctor-management/doctor-management';
import { DoctorDashboard } from './features/doctor/doctor-dashboard/doctor-dashboard';

// Patient
import { PatientRegistration } from './features/patient/patient-registration/patient-registration';

// Appointment
import { AppointmentBooking } from './features/appointment/appointment-booking/appointment-booking';

// Public Pages
import { LandingPage } from './features/landing-page/landing-page';
import { AboutUs } from './features/about-us/about-us';
import { PreRegister } from './features/pre-register/pre-register';
import { ContactUs } from './features/contact-us/contact-us';
import { Services } from './features/services/services';
import { Language } from './features/language/language';

// Authentication
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

export const routes: Routes = [

  // Default Route
  {
    path: '',
    redirectTo: 'appointment',
    pathMatch: 'full'
  },

  // Prescription
  {
    path: 'prescription/add/:appointmentId',
    component: PrescriptionAdd
  },

  // Doctor
  {
    path: 'doctor/add',
    component: DoctorAdd
  },
  {
    path: 'doctor',
    component: DoctorManagement
  },
  {
    path: 'doctor-dashboard',
    component: DoctorDashboard
  },
  {
    path: 'doctor/leave',
    component: DoctorLeave
  },
  {
    path: 'doctor/leave-requests',
    component: DoctorLeaveRequest
  },

  // Patient
  {
    path: 'patient',
    component: PatientRegistration
  },

  // Appointment
  {
    path: 'appointment',
    component: AppointmentBooking
  },

  // Public Pages
  {
    path: 'about-us',
    component: AboutUs
  },
  {
    path: 'pre-register',
    component: PreRegister
  },
  {
    path: 'contact-us',
    component: ContactUs
  },
  {
    path: 'services',
    component: Services
  },
  {
    path: 'language',
    component: Language
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'forgot-password',
    component: ForgotPassword
  },
  {
    path: 'reset-password',
    component: ResetPassword
  },
  {
    path: 'reset-password-success',
    component: ResetPasswordSuccess
  },

  // Financial & Medical
  {
    path: 'billing',
    component: Billing
  },
  {
    path: 'final-bill',
    component: FinalBill
  },
  {
    path: 'medicine',
    component: Medicine
  },
  {
    path: 'reports',
    component: Reports
  },
  {
    path: 'profile',
    component: Profile
  },
  {
    path: 'settings',
    component: Settings
  },

  // Landing Page
  {
    path: 'landing',
    component: LandingPage
  },

  // Wildcard Route
  {
    path: '**',
    redirectTo: 'appointment'
  }

];