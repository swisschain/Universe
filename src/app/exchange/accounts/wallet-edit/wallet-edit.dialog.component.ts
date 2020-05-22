import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { markFormGroupTouched, isFormGroupControlHasError } from '../../shared/utils/validation-utils'

import { Wallet, WalletType } from '../../api/models/wallets';
import { WalletService } from '../../api/services';

@Component({
  selector: 'kt-wallet-edit-dialog',
  templateUrl: './wallet-edit.dialog.component.html',
  styleUrls: ['./wallet-edit.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class WalletEditDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WalletEditDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private walletService: WalletService) {
  }

  accountId: number;
  walletId: number;
  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  ngOnInit() {
    this.accountId = this.data.accountId;
    this.walletId = this.data.walletId;
    this.createForm();
    this.load();
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(36)]
      )],
      type: [{ value: null, disabled: this.walletId ? true : false }, Validators.required],
      isEnabled: [true, Validators.required]
    });
  }

  load() {
    if (this.walletId) {
      this.viewLoading = true;
      this.walletService.getById(this.walletId)
        .subscribe(result => {
          this.setValues(result)
          this.viewLoading = false;
        });
    }
  }

  setValues(wallet: Wallet) {
    this.form.controls.name.setValue(wallet.name);
    this.form.controls.type.setValue(wallet.type);
    this.form.controls.isEnabled.setValue(wallet.isEnabled);
  }

  onSubmit() {
    this.hasFormErrors = false;

    if (this.form.invalid) {
      markFormGroupTouched(this.form);
      return;
    }

    const wallet = this.prepare();

    if (wallet.id) {
      this.update(wallet);
    } else {
      this.create(wallet);
    }
  }

  private prepare(): Wallet {
    const controls = this.form.controls;
    return {
      id: this.walletId,
      accountId: this.accountId,
      name: controls.name.value,
      type: controls.type.value,
      isEnabled: controls.isEnabled.value,
      created: null,
      modified: null
    };
  }

  private create(wallet: Wallet) {
    this.viewLoading = true;
    this.walletService.add(wallet.name, wallet.accountId, wallet.isEnabled, wallet.type)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ wallet, isEdit: true });
        },
        errorResponse => {
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while creating wallet';
          this.viewLoading = false;
          this.cdr.markForCheck();
        }
      );
  }

  private update(wallet: Wallet) {
    this.viewLoading = true;
    this.walletService.update(wallet.id, wallet.name, wallet.isEnabled)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ wallet, isEdit: true });
        },
        errorResponse => {
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while updating wallet';
          this.viewLoading = false;
          this.cdr.markForCheck();
        }
      );
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    return isFormGroupControlHasError(this.form, controlName, validationType);
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
    this.errorMessage = '';
  }
}
