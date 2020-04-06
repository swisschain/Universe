import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitOrderEditDialogComponent } from './limit-order-edit.component';

describe('LimitOrderEditDialogComponent', () => {
  let component: LimitOrderEditDialogComponent;
  let fixture: ComponentFixture<LimitOrderEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimitOrderEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitOrderEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
