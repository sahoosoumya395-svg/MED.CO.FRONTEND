export interface Doctor {

  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  nationality: string;

  registrationCode: number;

  mobileNumber: string;
  alternateMobileNumber?: string;

  email: string;
  username: string;
  password: string;

  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;

  medicalRegistrationNumber: string;
  qualification: string;
  specialization: string;
  experience: number;
  departmentId: number;
  designation: string;
}