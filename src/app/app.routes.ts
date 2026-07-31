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

// Billing, Medicine, Reports, Profile, Settings
import { Billing } from './features/billing/billing';
import { FinalBill } from './features/final-bill/final-bill';
import { Medicine } from './features/medicine/medicine';
import { Reports } from './features/reports/reports';
import { Profile } from './features/profile/profile';
import { Settings } from './features/settings/settings';

export const routes: Routes = [
  // Public & Auth Routes
  { path: '', component: LandingPage, pathMatch: 'full' },
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

  // Financial & Medical
  { path: 'billing', component: Billing },
  { path: 'final-bill', component: FinalBill },
  { path: 'medicine', component: Medicine },
  { path: 'reports', component: Reports },
  { path: 'profile', component: Profile },
  { path: 'settings', component: Settings },

  // Fallback Route
  { path: '**', redirectTo: '' }
];