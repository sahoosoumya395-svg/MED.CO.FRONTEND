import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentAvailability } from './department-availability';

describe('DepartmentAvailability', () => {
  let component: DepartmentAvailability;
  let fixture: ComponentFixture<DepartmentAvailability>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentAvailability],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentAvailability);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
