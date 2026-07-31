import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-dashboard.html',
  styleUrls: ['./doctor-dashboard.css']
})
export class DoctorDashboard {

  // Doctor Information
  doctor = {
    doctorId: 'DOC001',
    name: 'Dr. John Doe',
    department: 'Cardiology',
    specialization: 'Cardiologist',
    email: 'john@example.com',
    phone: '9876543210'
  };

  // Dashboard Cards
  todayAppointments = 12;
  todayPatients = 8;
  departmentDoctors = 5;

  // Weekly Schedule
  schedule = [
    { day: 'Monday', shift: 'Morning', time: '09:00 AM - 01:00 PM' },
    { day: 'Tuesday', shift: 'Evening', time: '02:00 PM - 06:00 PM' },
    { day: 'Wednesday', shift: 'Morning', time: '09:00 AM - 01:00 PM' },
    { day: 'Thursday', shift: 'Evening', time: '02:00 PM - 06:00 PM' },
    { day: 'Friday', shift: 'Morning', time: '09:00 AM - 01:00 PM' }
  ];

  // Department Availability
  departments = [
    { name: 'Cardiology', total: 5, available: 4 },
    { name: 'Neurology', total: 3, available: 2 },
    { name: 'Orthopedics', total: 4, available: 3 },
    { name: 'Pediatrics', total: 6, available: 5 }
  ];

  // Doctors Status
  doctorsStatus = [
    { name: 'Dr. Rahul', department: 'Cardiology', status: 'Available' },
    { name: 'Dr. Priya', department: 'Neurology', status: 'On Leave' },
    { name: 'Dr. Amit', department: 'Orthopedics', status: 'Available' },
    { name: 'Dr. Neha', department: 'Pediatrics', status: 'In Consultation' }
  ];

}
