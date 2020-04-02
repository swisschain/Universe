import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerAccountDetailsComponent } from './broker-account-details.component';

describe('BrokerAccountDetailsComponent', () => {
  let component: BrokerAccountDetailsComponent;
  let fixture: ComponentFixture<BrokerAccountDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerAccountDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
