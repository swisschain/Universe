import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBookDetailsComponent } from './order-book-details.component';

describe('OrderBookDetailsComponent', () => {
  let component: OrderBookDetailsComponent;
  let fixture: ComponentFixture<OrderBookDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderBookDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBookDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
