import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitesDialogComponent } from './requisites.dialog.component';

describe('RequisitesDialogComponent', () => {
  let component: RequisitesDialogComponent;
  let fixture: ComponentFixture<RequisitesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequisitesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
