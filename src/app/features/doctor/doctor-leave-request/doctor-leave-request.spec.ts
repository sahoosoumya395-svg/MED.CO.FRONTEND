import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorLeaveRequest } from './doctor-leave-request';

describe('DoctorLeaveRequest', () => {
  let component: DoctorLeaveRequest;
  let fixture: ComponentFixture<DoctorLeaveRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorLeaveRequest],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorLeaveRequest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
