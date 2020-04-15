import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionParticipantListComponent } from './subscription-participant-list.component';

describe('SubscriptionParticipantListComponent', () => {
  let component: SubscriptionParticipantListComponent;
  let fixture: ComponentFixture<SubscriptionParticipantListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionParticipantListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionParticipantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
