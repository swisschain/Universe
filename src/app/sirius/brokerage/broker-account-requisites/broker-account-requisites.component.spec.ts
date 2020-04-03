import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerAccountRequisitesComponent } from './broker-account-requisites.component';

describe('BrokerAccountRequisitesComponent', () => {
  let component: BrokerAccountRequisitesComponent;
  let fixture: ComponentFixture<BrokerAccountRequisitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerAccountRequisitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerAccountRequisitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
