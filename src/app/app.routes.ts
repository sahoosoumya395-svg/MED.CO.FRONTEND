import { Routes } from '@angular/router';

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

// Dashboards
import { AdminDashboard } from './features/dashboard/admin-dashboard/admin-dashboard';
import { DoctorDashboard } from './features/doctor/doctor-dashboard/doctor-dashboard';
import { PatientDashboard } from './features/dashboard/patient-dashboard/patient-dashboard';

// Financial, Medical, User Profile & Settings
import { Billing } from './features/billing/billing';
import { FinalBill } from './features/final-bill/final-bill';
import { Medicine } from './features/medicine/medicine';
import { Reports } from './features/reports/reports';
import { Profile } from './features/profile/profile';
import { Settings } from './features/settings/settings';

// Patient Management
import { PatientRegistration } from './features/patient/patient-registration/patient-registration';
import { PatientAdd } from './features/patient/patient-add/patient-add';
import { PatientEdit } from './features/patient/patient-edit/patient-edit';
import { PatientList } from './features/patient/patient-list/patient-list';
import { PatientDetails } from './features/patient/patient-details/patient-details';

// Doctor Management
import { DoctorManagement } from './features/doctor/doctor-management/doctor-management';
import { DoctorAdd } from './features/doctor/doctor-add/doctor-add';
import { DoctorEdit } from './features/doctor/doctor-edit/doctor-edit';
import { DoctorList } from './features/doctor/doctor-list/doctor-list';
import { DoctorProfile } from './features/doctor/doctor-profile/doctor-profile';
import { DoctorStatus } from './features/doctor/doctor-status/doctor-status';
import { DepartmentAvailability } from './features/doctor/department-availability/department-availability';
import { LeaveRequest } from './features/doctor/leave-request/leave-request';
import { LeaveHistory } from './features/doctor/leave-history/leave-history';
import { MyProfile } from './features/doctor/my-profile/my-profile';
import { MyShedule } from './features/doctor/my-shedule/my-shedule';

// Appointment Management
import { AppointmentBooking } from './features/appointment/appointment-booking/appointment-booking';
import { AppointmentAdd } from './features/appointment/appointment-add/appointment-add';
import { AppointmentList } from './features/appointment/appointment-list/appointment-list';
import { AppointmentCalendar } from './features/appointment/appointment-calendar/appointment-calendar';

// Prescription Management
import { PrescriptionAdd } from './features/prescription/prescription-add/prescription-add';
import { PrescriptionList } from './features/prescription/prescription-list/prescription-list';
import { PrescriptionView } from './features/prescription/prescription-view/prescription-view';

export const routes: Routes = [
  // Default Landing Page Route (Main URL: /)
  { path: '', component: LandingPage, pathMatch: 'full' },
  { path: 'landing-page', redirectTo: '', pathMatch: 'full' },

  // Public & Auth Routes
  { path: 'about-us', component: AboutUs },
  { path: 'pre-register', component: PreRegister },
  { path: 'contact-us', component: ContactUs },
  { path: 'services', component: Services },
  { path: 'language', component: Language },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword },
  { path: 'reset-password-success', component: ResetPasswordSuccess },

  // Dashboard Routes
  { path: 'admin-dashboard', component: AdminDashboard },
  { path: 'doctor-dashboard', component: DoctorDashboard },
  { path: 'patient-dashboard', component: PatientDashboard },

  // Financial & Medical Routes
  { path: 'billing', component: Billing },
  { path: 'final-bill', component: FinalBill },
  { path: 'medicine', component: Medicine },
  { path: 'reports', component: Reports },
  { path: 'profile', component: Profile },
  { path: 'settings', component: Settings },

  // Patient Routes
  { path: 'patient', component: PatientRegistration },
  { path: 'patient/register', component: PatientRegistration },
  { path: 'patient/add', component: PatientAdd },
  { path: 'patient/edit', component: PatientEdit },
  { path: 'patient/list', component: PatientList },
  { path: 'patient/details', component: PatientDetails },

  // Doctor Routes
  { path: 'doctor', component: DoctorManagement },
  { path: 'doctor/management', component: DoctorManagement },
  { path: 'doctor/add', component: DoctorAdd },
  { path: 'doctor/edit', component: DoctorEdit },
  { path: 'doctor/list', component: DoctorList },
  { path: 'doctor/profile', component: DoctorProfile },
  { path: 'doctor/status', component: DoctorStatus },
  { path: 'doctor/department-availability', component: DepartmentAvailability },
  { path: 'doctor/leave-request', component: LeaveRequest },
  { path: 'doctor/leave-history', component: LeaveHistory },
  { path: 'doctor/my-profile', component: MyProfile },
  { path: 'doctor/my-schedule', component: MyShedule },

  // Appointment Routes
  { path: 'appointment', component: AppointmentBooking },
  { path: 'appointment/booking', component: AppointmentBooking },
  { path: 'appointment/add', component: AppointmentAdd },
  { path: 'appointment/list', component: AppointmentList },
  { path: 'appointment/calendar', component: AppointmentCalendar },

  // Prescription Routes
  { path: 'prescription/add', component: PrescriptionAdd },
  { path: 'prescription/list', component: PrescriptionList },
  { path: 'prescription/view', component: PrescriptionView },

  // Fallback Route
  { path: '**', redirectTo: '' }
];
