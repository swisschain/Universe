import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingFeeHistoryComponent } from './trading-fee-history.component';

describe('TradingFeeHistoryComponent', () => {
  let component: TradingFeeHistoryComponent;
  let fixture: ComponentFixture<TradingFeeHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradingFeeHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradingFeeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
