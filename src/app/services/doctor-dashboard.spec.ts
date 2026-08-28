import { TestBed } from '@angular/core/testing';

import { DoctorDashboard } from './doctor-dashboard';

describe('DoctorDashboard', () => {
  let service: DoctorDashboard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorDashboard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
