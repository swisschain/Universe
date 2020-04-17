import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsDialogComponent } from './order-details.dialog.component';

describe('OrderDetailsDialogComponent', () => {
  let component: OrderDetailsDialogComponent;
  let fixture: ComponentFixture<OrderDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
