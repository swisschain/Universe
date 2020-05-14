import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Account } from '../../api/models/accounts';
import { AccountService } from '../../api/services';

@Component({
  selector: 'kt-account-edit-dialog',
  templateUrl: './account-edit.dialog.component.html',
  styleUrls: ['./account-edit.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AccountEditDialogComponent implements OnInit, OnDestroy {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AccountEditDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private accountService: AccountService) {
  }

  account: Account;
  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  ngOnInit() {
    this.account = this.data.account;
    this.createForm();
  }

  ngOnDestroy() {
  }

  createForm() {
    this.form = this.fb.group({
      name: [this.account.name, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(36)]
      )],
      isDisabled: [this.account.isDisabled, Validators.required]
    });
  }

  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.form.controls;

    if (this.form.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    const name = controls.name.value;
    const isDisabled = controls.isDisabled.value;

    if (this.account.id) {
      this.update(name, isDisabled);
    } else {
      this.create(name, isDisabled);
    }
  }

  create(name: string, isDisabled: boolean) {
    this.viewLoading = true;
    this.accountService.add(name, isDisabled)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ isEdit: true });
        },
        error => {
          this.viewLoading = false;
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while adding account.';
          this.cdr.markForCheck();
        }
      );
  }

  update(name: string, isDisabled: boolean) {
    this.viewLoading = true;
    this.accountService.update(this.account.id, name, isDisabled)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ isEdit: true });
        },
        error => {
          this.viewLoading = false;
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while updating account.';
          this.cdr.markForCheck();
        }
      );
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.form.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
    this.errorMessage = '';
  }
}
