import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AssetService, OperationsService } from '../../api/services';

@Component({
  selector: 'kt-cash-transfer-dialog',
  templateUrl: './cash-transfer.dialog.component.html',
  styleUrls: ['./cash-transfer.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CashTransferDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CashTransferDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private assetService: AssetService,
    private operationsService: OperationsService) {
  }

  private asset: string;

  walletId: string;
  assets: string[];
  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  ngOnInit() {
    this.asset = this.data.asset;
    this.walletId = this.data.walletId;

    this.viewLoading = true;

    this.assetService.getAll()
      .subscribe(assets => {
        this.assets = assets.map(asset => asset.symbol);
        this.viewLoading = false;
        this.cdr.markForCheck();
      });

    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      asset: [this.asset, Validators.required],
      amount: [0, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(10000)]
      )],
      fromWallet: [{ value: this.walletId, disabled: true }, Validators.compose([
        Validators.required,
        Validators.maxLength(36)]
      )],
      toWallet: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(36)]
      )],
      description: ['', Validators.compose([
        Validators.maxLength(1000)]
      )],
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

    this.transfer(controls.asset.value, controls.amount.value, controls.toWallet.value, controls.description.value);
  }

  transfer(asset: string, amount: number, toWallet: string, description: string) {
    this.viewLoading = true;
    this.operationsService.transfer(asset, amount, this.walletId, toWallet, description)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ isEdit: true });
        },
        error => {
          this.viewLoading = false;
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while transfer.';
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
