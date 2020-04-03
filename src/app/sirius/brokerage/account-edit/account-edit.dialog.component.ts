import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessageType, LayoutUtilsService } from '../../../core/_base/crud';
import { BrokerAccountService } from '../../api/broker-account.service';
import { BrokerAccount } from '../../api/models/brocker-account/broker-account.interface';
import { AccountService } from '../../api/account.service';

@Component({
  selector: 'kt-account-edit-dialog',
  templateUrl: './account-edit.dialog.component.html',
  styleUrls: ['./account-edit.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AccountEditDialogComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AccountEditDialogComponent>,
    private fb: FormBuilder,
    private accountService: AccountService,
    private brokerAccountService: BrokerAccountService,
    private layoutUtilsService: LayoutUtilsService) {
  }

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
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  createForm() {
    this.form = this.fb.group({
      brokerAccountId: [null, Validators.required],
      referenceId: ['', Validators.compose([Validators.required, Validators.maxLength(50)])]
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

      this.hasFormErrors = true;
      return;
    }

    this.create(controls.brokerAccountId.value, controls.referenceId.value);
  }

  create(brokerAccountId: number, referenceId: string) {
    this.viewLoading = true;
    this.accountService.create(brokerAccountId, referenceId)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ account: response });
        },
        error => {
          this.viewLoading = false;
          console.log('Account creating error', error);
          this.layoutUtilsService.showActionNotification('An error occurred while creating account.', MessageType.Update, 3000, true, false);
        }
      );
  }
}
