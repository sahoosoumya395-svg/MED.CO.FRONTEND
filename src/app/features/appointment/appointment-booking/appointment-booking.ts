import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DepartmentService } from '../../../services/department';
import { DoctorService } from '../../../services/doctor';
import { DoctorAvailabilityService } from '../../../services/doctor-availability';
import { AppointmentService } from '../../../services/appointment';

@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './appointment-booking.html',
  styleUrl: './appointment-booking.css'
})
export class AppointmentBooking implements OnInit {

  // Department
  departments: any[] = [];
  selectedDepartmentId: number | null = null;

  // Doctor
  doctors: any[] = [];
  selectedDoctorId: number | null = null;

  // Availability
  availability: any[] = [];

  // Selected Date & Time
  selectedDate: string = '';
  selectedTime: string = '';

  // Time Slots
  timeSlots: string[] = [];

  // Patient Details
  mrnNo: string = '';
  patientName: string = '';
  age: number | null = null;
  gender: string = '';
  mobileNumber: string = '';
  email: string = '';
  address: string = '';
  patientId: number | null = null;
  reason: string = '';

  constructor(
    private departmentService: DepartmentService,
    private doctorService: DoctorService,
    private doctorAvailabilityService: DoctorAvailabilityService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  // Load Departments
loadDepartments(): void {

    this.departmentService.getAllDepartments().subscribe({

      next: (response) => {
        this.departments = response.data;
        console.log("Departments:", this.departments);
      },

      error: (error) => {
        console.error("Error loading departments", error);
      }

    });

  }
  // Load Doctors
  loadDoctors(): void {

    if (!this.selectedDepartmentId) {

      this.doctors = [];
      this.selectedDoctorId = null;
      this.availability = [];
      this.timeSlots = [];

      return;

    }

    this.doctorService
      .getDoctorsByDepartment(this.selectedDepartmentId)
      .subscribe({

        next: (response) => {

          this.doctors = response;

          console.log("Doctors:", this.doctors);

        },

        error: (error) => {

          console.error("Error loading doctors", error);

        }

      });

  }

  // Select Doctor
  selectDoctor(id: number): void {

    this.selectedDoctorId = id;

    this.loadAvailability();

  }

  // Load Doctor Availability
  loadAvailability(): void {

    if (!this.selectedDoctorId) {

      this.availability = [];
      this.timeSlots = [];

      return;

    }

    this.doctorAvailabilityService
      .getAvailabilityByDoctor(this.selectedDoctorId)
      .subscribe({

        next: (response) => {

          this.availability = response.data;

          console.log("Availability:", this.availability);

        },

        error: (error) => {

          console.error("Error loading availability", error);

        }

      });

  }

  // Select Date
  selectDate(item: any): void {

    this.selectedDate = item.availableDate;

    this.generateTimeSlots(
      item.startTime,
      item.endTime
    );

  }

  // Generate 30-minute Time Slots
  generateTimeSlots(start: string, end: string): void {

    this.timeSlots = [];

    let hour = Number(start.substring(0, 2));
    let minute = Number(start.substring(3, 5));

    const endHour = Number(end.substring(0, 2));
    const endMinute = Number(end.substring(3, 5));

    while (
      hour < endHour ||
      (hour === endHour && minute < endMinute)
    ) {

      const h = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');

      this.timeSlots.push(`${h}:${m}`);

      minute += 30;

      if (minute >= 60) {
        minute = 0;
        hour++;
      }

    }

    console.log("Time Slots:", this.timeSlots);

  }

  // Select Time
  selectTime(time: string): void {

    this.selectedTime = time;

    console.log("Selected Time:", this.selectedTime);

  }
  // Calculate Age from Date of Birth
  calculateAge(dateOfBirth: string): number {

    const dob = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();

    const monthDifference = today.getMonth() - dob.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < dob.getDate())
    ) {
      age--;
    }

    return age;

  }

  // Search Patient by MRN
  searchPatient(): void {

    if (!this.mrnNo) {
      alert("Please enter MRN Number");
      return;
    }

    this.appointmentService.getPatientByMrn(this.mrnNo).subscribe({

      next: (response) => {

        const patient = response.data;
        this.patientId = patient.patientId;

        this.patientName =
          patient.firstName + " " +
          (patient.middleName ? patient.middleName + " " : "") +
          patient.lastName;

        // Calculate age from Date of Birth
        this.age = this.calculateAge(patient.dateOfBirth);

        this.gender = patient.gender;
        this.mobileNumber = patient.mobileNumber;
        this.address = patient.address;

        // Email is not available in your PatientResponseDto
        this.email = "";

        console.log("Patient Details:", patient);

      },

      error: (error) => {

        console.error(error);
        alert("Patient not found");

      }

    });

  }

// book apporinoment//
bookAppointment(): void {

  if (!this.patientId) {
    alert("Please search patient using MRN Number");
    return;
  }

  if (!this.selectedDoctorId) {
    alert("Please select a doctor");
    return;
  }

  if (!this.selectedDate) {
    alert("Please select appointment date");
    return;
  }

  if (!this.selectedTime) {
    alert("Please select appointment time");
    return;
  }

  if (!this.reason.trim()) {
    alert("Please enter appointment reason");
    return;
  }

  const appointment = {

    doctorId: this.selectedDoctorId,
    patientId: this.patientId,
    appointmentDate: this.selectedDate,
    appointmentTime: this.selectedTime,
    reason: this.reason

  };

  this.appointmentService.bookAppointment(appointment).subscribe({

    next: (response) => {

  console.log(response);
  alert("Appointment Booked Successfully");

  this.reason = "";
  this.selectedTime = "";
  this.timeSlots = [];
},
    error: (error) => {

      console.error(error);
      alert("Failed to Book Appointment");

    }

  });

}







}
