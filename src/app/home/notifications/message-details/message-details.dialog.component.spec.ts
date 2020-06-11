import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageDetailsDialogComponent } from './message-details.dialog.component';

describe('MessageDetailsDialogComponent', () => {
  let component: MessageDetailsDialogComponent;
  let fixture: ComponentFixture<MessageDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
