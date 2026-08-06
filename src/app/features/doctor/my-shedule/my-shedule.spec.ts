import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyShedule } from './my-shedule';

describe('MyShedule', () => {
  let component: MyShedule;
  let fixture: ComponentFixture<MyShedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyShedule],
    }).compileComponents();

    fixture = TestBed.createComponent(MyShedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
