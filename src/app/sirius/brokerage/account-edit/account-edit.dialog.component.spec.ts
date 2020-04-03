import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountEditDialogComponent } from './account-edit.dialog.component';

describe('AccountEditDialogComponent', () => {
  let component: AccountEditDialogComponent;
  let fixture: ComponentFixture<AccountEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
