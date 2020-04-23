import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashTransferDialogComponent } from './cash-transfer.dialog.component';

describe('CashTransferDialogComponent', () => {
  let component: CashTransferDialogComponent;
  let fixture: ComponentFixture<CashTransferDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashTransferDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashTransferDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
