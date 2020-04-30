import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiKeyDeletedListComponent } from './api-key-deleted-list.component';

describe('ApiKeyDeletedListComponent', () => {
  let component: ApiKeyDeletedListComponent;
  let fixture: ComponentFixture<ApiKeyDeletedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiKeyDeletedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiKeyDeletedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
