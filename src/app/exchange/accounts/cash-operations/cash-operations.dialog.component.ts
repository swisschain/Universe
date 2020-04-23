import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CashOperationType } from '../../models/cash-operation-type';
import { AssetsService } from '../../api/assets.service';
import { OperationsService } from '../../api/operations.service';

@Component({
  selector: 'kt-cash-operations.dialog',
  templateUrl: './cash-operations.dialog.component.html',
  styleUrls: ['./cash-operations.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CashOperationsDialogComponent implements OnInit, OnDestroy {

  private asset: string;
  operationType: CashOperationType;

  walletId: string;
  assets: string[];
  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  private componentSubscriptions: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CashOperationsDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private assetsService: AssetsService,
    private operationsService: OperationsService) {
  }

  ngOnInit() {
    this.asset = this.data.asset;
    this.operationType = this.data.operationType;
    this.walletId = this.data.walletId;

    this.viewLoading = true;
    this.assetsService.getAll()
      .subscribe(assets => {
        this.assets = assets.map(asset => asset.symbol);
        this.viewLoading = false;
        this.cdr.markForCheck();
      });
    this.createForm();
  }

  ngOnDestroy() {
    if (this.componentSubscriptions) {
      this.componentSubscriptions.unsubscribe();
    }
  }

  createForm() {
    this.form = this.fb.group({
      asset: [this.asset, Validators.required],
      amount: [0, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(10000)]
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

    if (this.operationType === CashOperationType.CashIn) {
      this.cashIn(controls.asset.value, controls.amount.value, controls.description.value);
    } else {
      this.cashOut(controls.asset.value, controls.amount.value, controls.description.value);
    }
  }

  cashIn(asset: string, amount: number, description: string) {
    this.viewLoading = true;
    this.operationsService.cashIn(this.walletId, asset, amount, description)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ isEdit: true });
        },
        error => {
          this.viewLoading = false;
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while cash-in.';
          this.cdr.markForCheck();
        }
      );
  }

  cashOut(asset: string, amount: number, description: string) {
    this.viewLoading = true;
    this.operationsService.cashOut(this.walletId, asset, amount, description)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ isEdit: true });
        },
        error => {
          this.viewLoading = false;
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while cash-out.';
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
