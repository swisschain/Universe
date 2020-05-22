import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceTotalListComponent } from './balance-total-list.component';

describe('BalanceTotalListComponent', () => {
  let component: BalanceTotalListComponent;
  let fixture: ComponentFixture<BalanceTotalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceTotalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceTotalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
