import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBookListComponent } from './order-book-list.component';

describe('OrderBookListComponent', () => {
  let component: OrderBookListComponent;
  let fixture: ComponentFixture<OrderBookListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderBookListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
