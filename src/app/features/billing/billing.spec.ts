import { ComponentFixture, TestBed } from '@angular/core/testing';


import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';


import { Billing } from './billing';

describe('Billing', () => {
  let component: Billing;
  let fixture: ComponentFixture<Billing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [Billing, HttpClientTestingModule],

    }).compileComponents();

    fixture = TestBed.createComponent(Billing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('should add a medicine row when addMedicine() is called', () => {
    const initial = component.medicines.length;
    component.addMedicine();
    expect(component.medicines.length).toBe(initial + 1);
  });

  it('should remove a medicine row when removeMedicine() is called', () => {
    // ensure at least two rows
    component.addMedicine();
    const initial = component.medicines.length;
    component.removeMedicine(0);
    expect(component.medicines.length).toBe(initial - 1);
  });

  it('should add a row when + button is clicked in the template', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const initial = component.medicines.length;
    // find the add button (first visible add button in the table)
    const addBtn = fixture.debugElement.query(By.css('.add-btn'));
    expect(addBtn).toBeTruthy();

    addBtn.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.medicines.length).toBe(initial + 1);
  });

});
