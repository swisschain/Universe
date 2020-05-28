import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutContentEditComponent } from './layout-content-edit.component';

describe('LayoutContentEditComponent', () => {
  let component: LayoutContentEditComponent;
  let fixture: ComponentFixture<LayoutContentEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutContentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutContentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
