import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorStatus } from './doctor-status';

describe('DoctorStatus', () => {
  let component: DoctorStatus;
  let fixture: ComponentFixture<DoctorStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorStatus],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
