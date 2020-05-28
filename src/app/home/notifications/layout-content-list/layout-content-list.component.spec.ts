import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutContentListComponent } from './layout-content-list.component';

describe('LayoutContentListComponent', () => {
  let component: LayoutContentListComponent;
  let fixture: ComponentFixture<LayoutContentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutContentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutContentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
