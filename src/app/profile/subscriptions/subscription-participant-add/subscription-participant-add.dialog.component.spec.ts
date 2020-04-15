import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionParticipantAddDialogComponent } from './subscription-participant-add.dialog.component';

describe('SubscriptionParticipantAddDialogComponent', () => {
  let component: SubscriptionParticipantAddDialogComponent;
  let fixture: ComponentFixture<SubscriptionParticipantAddDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionParticipantAddDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionParticipantAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
