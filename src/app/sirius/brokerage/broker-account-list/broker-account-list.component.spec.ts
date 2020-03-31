import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerAccountListComponent } from './broker-account-list.component';

describe('BrokerAccountListComponent', () => {
  let component: BrokerAccountListComponent;
  let fixture: ComponentFixture<BrokerAccountListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerAccountListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
