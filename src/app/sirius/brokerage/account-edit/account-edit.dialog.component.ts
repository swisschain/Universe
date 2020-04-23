import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { v4 as uuidv4 } from 'uuid';

import { MessageType, LayoutUtilsService } from '../../../core/_base/crud';

import { AccountService } from '../../api/account.service';
import { BrokerAccount } from '../../api/models/brocker-account/broker-account.interface';
import { BrokerAccountService } from '../../api/broker-account.service';

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
    private accountService: AccountService,
    private brokerAccountService: BrokerAccountService,
    private layoutUtilsService: LayoutUtilsService) {
  }

  private requestId = uuidv4();

  form: FormGroup;
  hasFormErrors = false;
  viewLoading = false;
  brokerAccounts: BrokerAccount[];

  ngOnInit() {
    this.brokerAccountService.get()
      .subscribe(response => {
        this.brokerAccounts = response.items;
      });

    this.createForm();
  }

  ngOnDestroy() {
  }

  createForm() {
    this.form = this.fb.group({
      brokerAccountId: [null, Validators.required],
      referenceId: ['', Validators.maxLength(50)]
    });
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.form.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
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

    this.create(controls.brokerAccountId.value, controls.referenceId.value);
  }

  create(brokerAccountId: number, referenceId: string) {
    this.viewLoading = true;
    this.accountService.create(brokerAccountId, referenceId, this.requestId)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ account: response });
        },
        error => {
          this.viewLoading = false;
          this.layoutUtilsService.showActionNotification('An error occurred while creating account.', MessageType.Update, 3000, true, false);
        }
      );
  }
}
