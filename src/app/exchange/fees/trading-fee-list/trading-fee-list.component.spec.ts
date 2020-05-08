import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingFeeListComponent } from './trading-fee-list.component';

describe('TradingFeeListComponent', () => {
  let component: TradingFeeListComponent;
  let fixture: ComponentFixture<TradingFeeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradingFeeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradingFeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
