import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiKeyTokenComponent } from './api-key-token.dialog.component';

describe('ApiKeyTokenComponent', () => {
  let component: ApiKeyTokenComponent;
  let fixture: ComponentFixture<ApiKeyTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiKeyTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiKeyTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
