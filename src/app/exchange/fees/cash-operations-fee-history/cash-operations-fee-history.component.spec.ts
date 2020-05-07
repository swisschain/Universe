import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashOperationsFeeHistoryComponent } from './cash-operations-fee-history.component';

describe('CashOperationsFeeHistoryComponent', () => {
  let component: CashOperationsFeeHistoryComponent;
  let fixture: ComponentFixture<CashOperationsFeeHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashOperationsFeeHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashOperationsFeeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
