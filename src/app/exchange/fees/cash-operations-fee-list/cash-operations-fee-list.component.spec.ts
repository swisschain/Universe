import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashOperationsFeeListComponent } from './cash-operations-fee-list.component';

describe('CashOperationsFeeListComponent', () => {
  let component: CashOperationsFeeListComponent;
  let fixture: ComponentFixture<CashOperationsFeeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashOperationsFeeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashOperationsFeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
