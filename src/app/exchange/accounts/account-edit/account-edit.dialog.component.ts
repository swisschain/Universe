import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MessageType, LayoutUtilsService } from '../../../core/_base/crud';

import { Account } from '../../api/models/accounts/account.interface';
import { AccountsService } from '../../api/accounts.service';

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
    private accountsService: AccountsService,
    private layoutUtilsService: LayoutUtilsService) {
  }

  private componentSubscriptions: Subscription;

  account: Account;
  form: FormGroup;
  hasFormErrors = false;
  viewLoading = false;

  ngOnInit() {
    this.account = this.data.account;
    this.createForm();
  }

  ngOnDestroy() {
    if (this.componentSubscriptions) {
      this.componentSubscriptions.unsubscribe();
    }
  }

  createForm() {
    this.form = this.fb.group({
      name: [this.account.name, Validators.required],
      isDisabled: [this.account.isDisabled, Validators.required]
    });
  }

  getTitle(): string {
    if (this.account.id) {
      return 'Edit account';
    }

    return 'New account';
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.form.controls[controlName];
    const result = control.invalid && control.touched;
    return result;
  }

  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.form.controls;

    if (this.form.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
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
    this.accountsService.add(name, isDisabled)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ isEdit: true });
        },
        error => {
          this.viewLoading = false;
          console.log('Account adding error', error);
          this.layoutUtilsService.showActionNotification('An error occurred while adding account.', MessageType.Update, 3000, true, false);
        }
      );
  }

  update(name: string, isDisabled: boolean) {
    this.viewLoading = true;
    this.accountsService.update(this.account.id, name, isDisabled)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ isEdit: true });
        },
        error => {
          this.viewLoading = false;
          console.log('Account update error', error);
          this.layoutUtilsService.showActionNotification('An error occurred while updating account.', MessageType.Update, 3000, true, false);
        }
      );
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }
}
