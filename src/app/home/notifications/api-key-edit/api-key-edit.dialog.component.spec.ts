import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationApiKeyEditDialogComponent } from './api-key-edit.dialog.component';

describe('NotificationApiKeyEditDialogComponent', () => {
  let component: NotificationApiKeyEditDialogComponent;
  let fixture: ComponentFixture<NotificationApiKeyEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationApiKeyEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationApiKeyEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
