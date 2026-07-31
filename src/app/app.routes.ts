import { Routes } from '@angular/router';
import { DoctorAdd } from './features/doctor/doctor-add/doctor-add';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'doctor/add',
    pathMatch: 'full'
  },
  {
    path: 'doctor/add',
    component: DoctorAdd
  }
];