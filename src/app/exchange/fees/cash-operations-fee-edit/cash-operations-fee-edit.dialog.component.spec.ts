import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashOperationsFeeEditDialogComponent } from './cash-operations-fee-edit.dialog.component';

describe('CashOperationsFeeEditDialogComponent', () => {
  let component: CashOperationsFeeEditDialogComponent;
  let fixture: ComponentFixture<CashOperationsFeeEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashOperationsFeeEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashOperationsFeeEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
