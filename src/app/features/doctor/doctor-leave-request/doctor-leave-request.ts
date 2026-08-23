import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

import {
  DoctorLeaveService,
  DoctorLeave
} from '../../../services/doctor-leave';

@Component({
  selector: 'app-doctor-leave-request',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './doctor-leave-request.html',
  styleUrl: './doctor-leave-request.css'
})
export class DoctorLeaveRequest implements OnInit {

  // Original data from backend
  leaves: DoctorLeave[] = [];

  // Data displayed in table
  filteredLeaves: DoctorLeave[] = [];

  // Filters
  searchText: string = '';
  selectedStatus: string = '';
  selectedLeaveType: string = '';
  fromDate: string = '';
  toDate: string = '';

  // Loading / error
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private doctorLeaveService: DoctorLeaveService) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  // ==============================
  // LOAD ALL LEAVES
  // ==============================
  loadLeaves(): void {
    this.loading = true;
    this.errorMessage = '';

    this.doctorLeaveService.getAllLeaves().subscribe({
      next: (data) => {
        this.leaves = data || [];
        this.filteredLeaves = [...this.leaves];
        this.loading = false;
        console.log('Doctor leaves:', this.leaves);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error loading doctor leaves:', error);
        this.errorMessage = 'Unable to load leave requests. Please check the server connection.';
      }
    });
  }

  // ==============================
  // STAT COUNTS
  // ==============================
  getPendingCount(): number {
    return this.leaves.filter(l => l.status?.toUpperCase() === 'PENDING').length;
  }

  getApprovedCount(): number {
    return this.leaves.filter(l => l.status?.toUpperCase() === 'APPROVED').length;
  }

  getRejectedCount(): number {
    return this.leaves.filter(l => l.status?.toUpperCase() === 'REJECTED').length;
  }

  // ==============================
  // DAYS CALCULATION
  // ==============================
  getDays(from: string, to: string): number {
    if (!from || !to) return 0;
    const diff = new Date(to).getTime() - new Date(from).getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
  }

  // ==============================
  // FILTER
  // ==============================
  applyFilters(): void {
    const search = this.searchText.trim().toLowerCase();

    this.filteredLeaves = this.leaves.filter((leave) => {
      const matchesSearch  = !search || leave.doctorName?.toLowerCase().includes(search);
      const matchesStatus  = !this.selectedStatus  || leave.status?.toUpperCase()    === this.selectedStatus.toUpperCase();
      const matchesType    = !this.selectedLeaveType || leave.leaveType?.toUpperCase() === this.selectedLeaveType.toUpperCase();
      const matchesFrom    = !this.fromDate || leave.fromDate >= this.fromDate;
      const matchesTo      = !this.toDate   || leave.toDate   <= this.toDate;

      return matchesSearch && matchesStatus && matchesType && matchesFrom && matchesTo;
    });
  }

  // ==============================
  // ACCEPT LEAVE
  // ==============================
  acceptLeave(leave: DoctorLeave): void {
    if (leave.status?.toUpperCase() === 'APPROVED') return;

    const confirmed = confirm(`Approve leave request from ${leave.doctorName}?`);
    if (!confirmed) return;

    this.doctorLeaveService.updateLeaveStatus(leave.leaveId, 'APPROVED').subscribe({
      next: (updatedLeave) => {
        console.log('Leave approved:', updatedLeave);
        const index = this.leaves.findIndex(l => l.leaveId === leave.leaveId);
        if (index !== -1) this.leaves[index] = updatedLeave;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error approving leave:', error);
        alert('Failed to approve leave request.');
      }
    });
  }

  // ==============================
  // REJECT LEAVE
  // ==============================
  rejectLeave(leave: DoctorLeave): void {
    if (leave.status?.toUpperCase() === 'REJECTED') return;

    const confirmed = confirm(`Reject leave request from ${leave.doctorName}?`);
    if (!confirmed) return;

    this.doctorLeaveService.updateLeaveStatus(leave.leaveId, 'REJECTED').subscribe({
      next: (updatedLeave) => {
        console.log('Leave rejected:', updatedLeave);
        const index = this.leaves.findIndex(l => l.leaveId === leave.leaveId);
        if (index !== -1) this.leaves[index] = updatedLeave;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error rejecting leave:', error);
        alert('Failed to reject leave request.');
      }
    });
  }

  // ==============================
  // RESET FILTERS
  // ==============================
  resetFilters(): void {
    this.searchText = '';
    this.selectedStatus = '';
    this.selectedLeaveType = '';
    this.fromDate = '';
    this.toDate = '';
    this.filteredLeaves = [...this.leaves];
  }

  // ==============================
  // FORMAT HELPERS
  // ==============================
  formatLeaveType(type: string): string {
    if (!type) return '';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }

  formatStatus(status: string): string {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }
}
