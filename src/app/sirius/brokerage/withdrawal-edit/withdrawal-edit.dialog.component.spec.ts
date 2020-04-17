import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalEditDialogComponent } from './withdrawal-edit.dialog.component';

describe('WithdrawalEditDialogComponent', () => {
  let component: WithdrawalEditDialogComponent;
  let fixture: ComponentFixture<WithdrawalEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawalEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawalEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
