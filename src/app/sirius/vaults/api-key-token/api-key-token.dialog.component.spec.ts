import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiKeyTokenDialogComponent } from './api-key-token.dialog.component';

describe('ApiKeyTokenDialogComponent', () => {
  let component: ApiKeyTokenDialogComponent;
  let fixture: ComponentFixture<ApiKeyTokenDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApiKeyTokenDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiKeyTokenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
