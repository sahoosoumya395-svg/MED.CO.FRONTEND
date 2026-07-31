import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-booking.html',
  styleUrl: './appointment-booking.css'
})
export class AppointmentBooking {

  // Patient Details
  mrnNo: string = '';
  patientName: string = '';
  age: number = 0;
  gender: string = '';
  mobileNumber: string = '';
  email: string = '';
  address: string = '';

  // Appointment Details
  selectedDepartment: string = '';
  selectedDoctor: string = '';
  appointmentDate: string = '';
  selectedTime: string = '';

  // Department List
  departments = [
    'Cardiology',
    'Neurology',
    'Orthopedic',
    'ENT',
    'Dermatology',
    'General Medicine'
  ];

  // Doctor List
  doctors = [
    {
      name: 'Dr. Rahul Sharma',
      department: 'Cardiology',
      experience: '10 Years'
    },
    {
      name: 'Dr. Priya Patel',
      department: 'Neurology',
      experience: '8 Years'
    },
    {
      name: 'Dr. Amit Verma',
      department: 'Orthopedic',
      experience: '12 Years'
    }
  ];

  // Time Slots
  timeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '04:00 PM',
    '04:30 PM',
    '05:00 PM'
  ];

  // Search MRN (Dummy Data)
  searchPatient() {

    if (this.mrnNo === 'MRN1001') {

      this.patientName = 'Rahul Kumar';
      this.age = 28;
      this.gender = 'Male';
      this.mobileNumber = '9876543210';
      this.email = 'rahul@gmail.com';
      this.address = 'Bhubaneswar';

    } else {

      alert('Patient Not Found');

      this.patientName = '';
      this.age = 0;
      this.gender = '';
      this.mobileNumber = '';
      this.email = '';
      this.address = '';

    }

  }

  // Select Doctor
  selectDoctor(name: string) {

    this.selectedDoctor = name;

  }

  // Select Time
  selectTime(time: string) {

    this.selectedTime = time;

  }

  // Book Appointment
  bookAppointment() {

    if (
      this.mrnNo == '' ||
      this.selectedDepartment == '' ||
      this.selectedDoctor == '' ||
      this.appointmentDate == '' ||
      this.selectedTime == ''
    ) {

      alert('Please Fill All Details');
      return;

    }

    alert('Appointment Booked Successfully');

    console.log({

      mrnNo: this.mrnNo,
      patientName: this.patientName,
      department: this.selectedDepartment,
      doctor: this.selectedDoctor,
      appointmentDate: this.appointmentDate,
      appointmentTime: this.selectedTime

    });

  }

}
