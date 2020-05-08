import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingFeeLevelListComponent } from './trading-fee-level-list.component';

describe('TradingFeeLevelListComponent', () => {
  let component: TradingFeeLevelListComponent;
  let fixture: ComponentFixture<TradingFeeLevelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradingFeeLevelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradingFeeLevelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
