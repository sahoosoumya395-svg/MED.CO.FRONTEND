import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionView } from './prescription-view';

describe('PrescriptionView', () => {
  let component: PrescriptionView;
  let fixture: ComponentFixture<PrescriptionView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescriptionView],
    }).compileComponents();

    fixture = TestBed.createComponent(PrescriptionView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
