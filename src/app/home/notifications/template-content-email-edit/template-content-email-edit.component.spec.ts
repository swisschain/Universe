import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateContentEmailEditComponent } from './template-content-email-edit.component';

describe('TemplateContentEmailEditComponent', () => {
  let component: TemplateContentEmailEditComponent;
  let fixture: ComponentFixture<TemplateContentEmailEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateContentEmailEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateContentEmailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
