import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LimitOrdersService } from '../../api/limit-orders.service';
import { LimitOrderType } from '../../api/models/order-books/limit-order-type.enum';
import { LimitOrderStatus } from '../../api/models/orders/limit-order-status.enum';
import { AssetPairsService } from '../../api/asset-pairs.service';

@Component({
  selector: 'kt-limit-order-edit-dialog',
  templateUrl: './limit-order-edit.dialog.component.html',
  styleUrls: ['./limit-order-edit.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class LimitOrderEditDialogComponent implements OnInit, OnDestroy {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LimitOrderEditDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private limitOrdersService: LimitOrdersService,
    private assetPairsService: AssetPairsService) {
  }

  walletId = '';
  types: LimitOrderType[] = [LimitOrderType.Sell, LimitOrderType.Buy];
  assetPairs: string[];
  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  ngOnInit() {
    this.walletId = this.data.walletId;
    this.createForm();

    this.viewLoading = true;
    this.assetPairsService.getAll()
      .subscribe(assetPairs => {
        this.assetPairs = assetPairs.map(assetPair => assetPair.symbol);
        this.viewLoading = false;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy() {
  }

  createForm() {
    this.form = this.fb.group({
      assetPair: [null, Validators.required],
      type: [null, Validators.required],
      price: [null, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(10000)]
      )],
      volume: [null, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(10000)]
      )],
      cancelPrevious: [false, Validators.required]
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

    this.create(controls.assetPair.value, controls.type.value, controls.price.value, controls.volume.value, controls.cancelPrevious.value);
  }

  create(assetPair: string, type: LimitOrderType, price: number, volume: number, cancelPrevious: boolean) {
    this.viewLoading = true;
    this.limitOrdersService.create(assetPair, this.walletId, type, price, volume, cancelPrevious)
      .subscribe(
        response => {
          this.viewLoading = false;

          if (response.status !== LimitOrderStatus.Ok) {
            this.hasFormErrors = true;
            this.errorMessage = `Can not create limit order: ${response.reason}`;
            this.cdr.markForCheck();
          }
          else {
            this.dialogRef.close({ limitOrderId: response.id, isEdit: true });
          }
        },
        error => {
          this.viewLoading = false;
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while creating limit order.';
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
