import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexTooltip,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexPlotOptions,
  ApexNonAxisChartSeries,
  ApexLegend
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  markers: ApexMarkers;
  colors: string[];
};

export type DonutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NgApexchartsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  isBrowser = false;
  isSidebarCollapsed = false;

  // Header & Date Info
  currentDate = '31 July 2025, Thursday';
  unreadMessagesCount = 8;
  unreadNotificationsCount = 5;

  // Stat Cards Data
  stats = {
    appointmentsToday: 136,
    appointmentsGrowth: 12,
    totalPatients: 1248,
    patientsGrowth: 8,
    totalDoctors: 48,
    totalBeds: 78,
    availableBeds: 32,
    totalRevenue: '₹ 3,62,450',
    revenueGrowth: 15
  };

  // ApexChart Options: Appointments Overview Spline Area Chart & Status Donut Chart
  public appointmentsChartOptions!: ChartOptions;
  public appointmentStatusChartOptions!: DonutChartOptions;
  totalAppointmentsCount = 136;

  // Appointments Status Breakdown
  appointmentsByStatus = [
    { label: 'Scheduled', count: 72, percentage: '52.94%', color: '#1865f2' },
    { label: 'Completed', count: 38, percentage: '27.94%', color: '#00c853' },
    { label: 'Cancelled', count: 16, percentage: '11.76%', color: '#ff3547' },
    { label: 'No Show', count: 10, percentage: '7.35%', color: '#ff9f00' }
  ];

  // Recent Appointments List
  recentAppointments = [
    { patient: 'Rohan Sharma', doctor: 'Dr. Amit Verma', department: 'Cardiology', time: '10:00 AM', avatarColor: '#e0e7ff', textColor: '#4338ca' },
    { patient: 'Priya Patel', doctor: 'Dr. Neha Singh', department: 'Neurology', time: '10:30 AM', avatarColor: '#dcfce7', textColor: '#15803d' },
    { patient: 'Mohit Kumar', doctor: 'Dr. Rajesh Kumar', department: 'Orthopedics', time: '11:00 AM', avatarColor: '#fef3c7', textColor: '#b45309' },
    { patient: 'Anjali Mehta', doctor: 'Dr. Pooja Mehta', department: 'Dermatology', time: '11:30 AM', avatarColor: '#f3e8ff', textColor: '#6b21a8' },
    { patient: 'Suresh Yadav', doctor: 'Dr. R. Sharma', department: 'General Medicine', time: '12:00 PM', avatarColor: '#e0f2fe', textColor: '#0369a1' }
  ];

  // Department-wise Patient Count
  departmentPatients = [
    { department: 'General Medicine', patients: 320, percentage: 25.64, barColor: '#2563eb' },
    { department: 'Cardiology', patients: 210, percentage: 16.83, barColor: '#10b981' },
    { department: 'Orthopedics', patients: 185, percentage: 14.81, barColor: '#f97316' },
    { department: 'Neurology', patients: 150, percentage: 12.02, barColor: '#8b5cf6' },
    { department: 'Pediatrics', patients: 130, percentage: 10.42, barColor: '#06b6d4' },
    { department: 'Others', patients: 253, percentage: 20.28, barColor: '#f43f5e' }
  ];

  // Staff Leave Status
  staffLeaves = [
    { name: 'Subhrajit Samal', fromDate: '2026-07-31', toDate: '2026-08-05', status: 'Pending', statusClass: 'status-pending' },
    { name: 'Priya Mishra', fromDate: '2026-07-28', toDate: '2026-08-02', status: 'Approved', statusClass: 'status-approved' },
    { name: 'Amit Verma', fromDate: '2026-07-27', toDate: '2026-07-31', status: 'Approved', statusClass: 'status-approved' },
    { name: 'Neha Singh', fromDate: '2026-07-26', toDate: '2026-07-30', status: 'Pending', statusClass: 'status-pending' },
    { name: 'Rajesh Kumar', fromDate: '2026-07-25', toDate: '2026-07-29', status: 'Rejected', statusClass: 'status-rejected' }
  ];

  // ApexChart Options: Bed Occupancy Donut Chart
  public bedOccupancyChartOptions!: DonutChartOptions;
  totalBedsCount = 120;
  occupiedBedsCount = 98;
  availableBedsCount = 22;

  // Quick Action Buttons
  quickActions = [
    { title: 'Add Appointment', icon: 'bi-calendar-plus', link: '/appointment/add', color: '#2563eb', bg: '#eff6ff' },
    { title: 'Add Patient', icon: 'bi-person-plus', link: '/patient/add', color: '#10b981', bg: '#ecfdf5' },
    { title: 'Add Doctor', icon: 'bi-heart-pulse', link: '/doctor/add', color: '#8b5cf6', bg: '#f5f3ff' },
    { title: 'Generate Report', icon: 'bi-file-earmark-text', link: '/reports', color: '#f59e0b', bg: '#fffbeb' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.initCharts();
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  private initCharts(): void {
    // Appointments Line/Area Spline Chart
    this.appointmentsChartOptions = {
      series: [
        {
          name: 'Appointments',
          data: [45, 60, 85, 70, 65, 55, 45]
        }
      ],
      chart: {
        type: 'area',
        height: 240,
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'Inter, sans-serif'
      },
      colors: ['#2563eb'],
      stroke: {
        curve: 'smooth',
        width: 3
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.35,
          opacityTo: 0.05,
          stops: [0, 90, 100]
        }
      },
      markers: {
        size: 5,
        colors: ['#2563eb'],
        strokeColors: '#ffffff',
        strokeWidth: 2,
        hover: { size: 7 }
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: {
          style: { colors: '#64748b', fontSize: '12px' }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 5,
        labels: {
          style: { colors: '#64748b', fontSize: '12px' }
        }
      },
      dataLabels: {
        enabled: true,
        style: { fontSize: '11px', colors: ['#2563eb'] },
        background: { enabled: false },
        offsetY: -6
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: (val: number) => `${val} Appointments`
        }
      }
    };

    // Appointments by Status Donut Chart
    this.appointmentStatusChartOptions = {
      series: [72, 38, 16, 10],
      chart: {
        type: 'donut',
        height: 180,
        width: 180,
        fontFamily: 'Inter, sans-serif'
      },
      labels: ['Scheduled', 'Completed', 'Cancelled', 'No Show'],
      colors: ['#1865f2', '#00c853', '#ff3547', '#ff9f00'],
      legend: { show: false },
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          donut: {
            size: '72%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                fontSize: '12px',
                color: '#94a3b8',
                formatter: () => `${this.totalAppointmentsCount}`
              },
              value: {
                show: true,
                fontSize: '22px',
                fontWeight: 700,
                color: '#0f172a',
                offsetY: 2
              }
            }
          }
        }
      }
    };

    // Bed Occupancy Donut Chart
    this.bedOccupancyChartOptions = {
      series: [this.occupiedBedsCount, this.availableBedsCount],
      chart: {
        type: 'donut',
        height: 160,
        width: 160,
        fontFamily: 'Inter, sans-serif'
      },
      labels: ['Occupied Beds', 'Available Beds'],
      colors: ['#2563eb', '#10b981'],
      legend: { show: false },
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          donut: {
            size: '72%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Available Beds',
                fontSize: '11px',
                color: '#64748b',
                formatter: () => `${this.availableBedsCount}`
              }
            }
          }
        }
      }
    };
  }
}
