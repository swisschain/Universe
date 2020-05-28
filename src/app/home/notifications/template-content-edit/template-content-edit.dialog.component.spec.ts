import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateContentEditDialogComponent } from './template-content-edit.dialog.component';

describe('TemplateContentEditDialogComponent', () => {
  let component: TemplateContentEditDialogComponent;
  let fixture: ComponentFixture<TemplateContentEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateContentEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateContentEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
