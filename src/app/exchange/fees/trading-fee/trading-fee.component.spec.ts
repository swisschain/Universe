import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingFeeComponent } from './trading-fee.component';

describe('TradingFeeComponent', () => {
  let component: TradingFeeComponent;
  let fixture: ComponentFixture<TradingFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradingFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradingFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
