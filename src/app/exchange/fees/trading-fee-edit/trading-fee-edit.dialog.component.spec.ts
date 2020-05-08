import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingFeeEditDialogComponent } from './trading-fee-edit.dialog.component';

describe('TradingFeeEditDialogComponent', () => {
  let component: TradingFeeEditDialogComponent;
  let fixture: ComponentFixture<TradingFeeEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradingFeeEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradingFeeEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
