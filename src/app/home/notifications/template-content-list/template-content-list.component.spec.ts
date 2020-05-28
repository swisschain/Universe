import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateContentListComponent } from './template-content-list.component';

describe('TemplateContentListComponent', () => {
  let component: TemplateContentListComponent;
  let fixture: ComponentFixture<TemplateContentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateContentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateContentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
