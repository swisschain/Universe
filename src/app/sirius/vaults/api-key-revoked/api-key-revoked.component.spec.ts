import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiKeyRevokedComponent } from './api-key-revoked.component';

describe('ApiKeyRevokedComponent', () => {
  let component: ApiKeyRevokedComponent;
  let fixture: ComponentFixture<ApiKeyRevokedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiKeyRevokedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiKeyRevokedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
