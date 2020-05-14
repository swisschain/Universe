import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LimitOrderType } from '../../api/models/order-books';
import { LimitOrderStatus } from '../../api/models/orders';
import { AssetPairService, MarketOrderService } from '../../api/services';

@Component({
  selector: 'kt-market-order-edit-dialog',
  templateUrl: './market-order-edit.dialog.component.html',
  styleUrls: ['./market-order-edit.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class MarketOrderEditDialogComponent implements OnInit, OnDestroy {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MarketOrderEditDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private marketOrderService: MarketOrderService,
    private assetPairService: AssetPairService) {
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
    this.assetPairService.getAll()
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
      volume: [null, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(10000)]
      )]
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

    this.create(controls.assetPair.value, controls.type.value, controls.volume.value);
  }

  create(assetPair: string, type: LimitOrderType, volume: number) {
    this.viewLoading = true;
    this.marketOrderService.create(assetPair, type, this.walletId, volume)
      .subscribe(
        response => {
          this.viewLoading = false;

          if (response.status !== LimitOrderStatus.Ok) {
            this.hasFormErrors = true;
            this.errorMessage = `Can not create market order: ${response.reason}`;
            this.cdr.markForCheck();
          }
          else {
            this.dialogRef.close({ marketOrderId: response.id, isEdit: true });
          }
        },
        error => {
          this.viewLoading = false;
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while creating market order.';
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
