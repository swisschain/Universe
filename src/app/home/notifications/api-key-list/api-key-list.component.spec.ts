import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationApiKeyListComponent } from './api-key-list.component';

describe('NotificationApiKeyListComponent', () => {
  let component: NotificationApiKeyListComponent;
  let fixture: ComponentFixture<NotificationApiKeyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationApiKeyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationApiKeyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
