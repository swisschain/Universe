import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiKeyEditDialogComponent } from './api-key-edit.dialog.component';

describe('ApiKeyEditDialogComponent', () => {
  let component: ApiKeyEditDialogComponent;
  let fixture: ComponentFixture<ApiKeyEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiKeyEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiKeyEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
