import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashOperationsFeeComponent } from './cash-operations-fee.component';

describe('CashOperationsFeeComponent', () => {
  let component: CashOperationsFeeComponent;
  let fixture: ComponentFixture<CashOperationsFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashOperationsFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashOperationsFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
