import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { v4 as uuidv4 } from 'uuid';

import { markFormGroupTouched, isFormGroupControlHasError, setFormError, getCommonError } from '../../shared/validation-utils'

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
export class AccountEditDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AccountEditDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private accountService: AccountService,
    private brokerAccountService: BrokerAccountService) {
  }

  private requestId = uuidv4();

  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  brokerAccounts: BrokerAccount[];

  ngOnInit() {
    this.viewLoading = true;
    this.brokerAccountService.get()
      .subscribe(response => {
        this.brokerAccounts = response.items;
        this.viewLoading = false;
        this.cdr.markForCheck();
      });

    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      brokerAccountId: [null, Validators.required],
      referenceId: ['', Validators.maxLength(50)]
    });
  }

  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.form.controls;

    if (this.form.invalid) {
      markFormGroupTouched(this.form);
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
        errorResponse => {
          const errorMessage = getCommonError(errorResponse);
          if (errorMessage) {
            this.hasFormErrors = true;
            this.errorMessage = errorMessage;
          }
          setFormError(this.form, errorResponse);
          this.viewLoading = false;
          this.cdr.markForCheck();
        }
      );
  }
  
  isFormControlHasError(controlName: string, validationType: string): boolean {
    return isFormGroupControlHasError(this.form, controlName, validationType);
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
    this.errorMessage = '';
  }
}
