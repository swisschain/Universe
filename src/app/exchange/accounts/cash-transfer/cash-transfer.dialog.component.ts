import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { getWalletTypeTitle } from '../../shared/utils'

import { Wallet, WalletType } from '../../api/models/wallets';
import { AssetService, OperationsService, WalletService } from '../../api/services';
import { forkJoin } from 'rxjs';

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
    private walletService: WalletService,
    private operationsService: OperationsService) {
  }

  private asset: string;

  wallets: Wallet[] = [];

  accountId: number;
  walletId: number;
  assets: string[];
  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  ngOnInit() {
    this.asset = this.data.asset;
    this.accountId = this.data.accountId as number;
    this.walletId = this.data.walletId as number;
    this.createForm();
    this.load();
  }

  createForm() {
    this.form = this.fb.group({
      asset: [this.asset, Validators.required],
      amount: [0, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(10000)]
      )],
      wallet: [null, Validators.compose([
        Validators.required]
      )],
      description: ['', Validators.compose([
        Validators.maxLength(1000)]
      )],
    });
  }

  load() {
    this.viewLoading = true;
    forkJoin([
      this.assetService.getAll(),
      this.walletService.getAll(this.accountId)
    ])
      .subscribe(data => {
        this.assets = data[0].map(asset => asset.symbol);
        this.wallets = data[1].filter(wallet => wallet.id != this.walletId);
        this.viewLoading = false;
        this.cdr.markForCheck();
      });
  }

  getWalletTypeTitle(walletType: WalletType) {
    return getWalletTypeTitle(walletType);
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

    this.transfer(controls.asset.value, controls.amount.value, controls.wallet.value, controls.description.value);
  }

  transfer(asset: string, amount: number, targetWalletId: number, description: string) {
    this.viewLoading = true;
    this.operationsService.transfer(this.accountId, asset, amount, this.walletId, targetWalletId, description)
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
