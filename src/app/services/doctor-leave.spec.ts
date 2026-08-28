import { TestBed } from '@angular/core/testing';

import { DoctorLeave } from './doctor-leave';

describe('DoctorLeave', () => {
  let service: DoctorLeave;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorLeave);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
