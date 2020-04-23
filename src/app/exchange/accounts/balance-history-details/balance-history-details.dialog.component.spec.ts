import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceHistoryDetailsDialogComponent } from './balance-history-details.dialog.component';

describe('BalanceHistoryDetailsDialogComponent', () => {
  let component: BalanceHistoryDetailsDialogComponent;
  let fixture: ComponentFixture<BalanceHistoryDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceHistoryDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceHistoryDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
