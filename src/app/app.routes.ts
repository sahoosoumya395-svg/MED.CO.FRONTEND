import { Routes } from '@angular/router';
import { PrescriptionAdd } from './features/prescription/prescription-add/prescription-add';
import { DoctorLeave } from './features/doctor/doctor-leave/doctor-leave';
import { DoctorLeaveRequest } from './features/doctor/doctor-leave-request/doctor-leave-request';

export const routes: Routes = [

  {
    path: 'prescription/add',
    component: PrescriptionAdd
  },

  {
  path: 'doctor/leave-requests',
  component: DoctorLeaveRequest
},

  {
    path: 'doctor/leave',
    component: DoctorLeave
  }

];