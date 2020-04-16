import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketOrderEditDialogComponent } from './market-order-edit.dialog.component';

describe('MarketOrderEditDialogComponent', () => {
  let component: MarketOrderEditDialogComponent;
  let fixture: ComponentFixture<MarketOrderEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketOrderEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketOrderEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
