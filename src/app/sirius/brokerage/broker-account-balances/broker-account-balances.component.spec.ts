import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerAccountBalancesComponent } from './broker-account-balances.component';

describe('BrokerAccountBalancesComponent', () => {
  let component: BrokerAccountBalancesComponent;
  let fixture: ComponentFixture<BrokerAccountBalancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerAccountBalancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerAccountBalancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
