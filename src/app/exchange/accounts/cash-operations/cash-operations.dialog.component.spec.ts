import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashOperationsDialogComponent } from './cash-operations.dialog.component';

describe('CashOperations.DialogComponent', () => {
  let component: CashOperationsDialogComponent;
  let fixture: ComponentFixture<CashOperationsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashOperationsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashOperationsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
