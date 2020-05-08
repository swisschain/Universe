import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingFeeLevelEditDialogComponent } from './trading-fee-level-edit.dialog.component';

describe('TradingFeeLevelEditDialogComponent', () => {
  let component: TradingFeeLevelEditDialogComponent;
  let fixture: ComponentFixture<TradingFeeLevelEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TradingFeeLevelEditDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradingFeeLevelEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
