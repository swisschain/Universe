import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiKeyActiveComponent } from './api-key-active.component';

describe('ApiKeyActiveComponent', () => {
  let component: ApiKeyActiveComponent;
  let fixture: ComponentFixture<ApiKeyActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiKeyActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiKeyActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
