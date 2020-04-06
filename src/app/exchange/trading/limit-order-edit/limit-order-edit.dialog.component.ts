import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MessageType, LayoutUtilsService } from '../../../core/_base/crud';

import { LimitOrdersService } from '../../api/limit-orders.service';
import { LimitOrderType } from '../../api/models/order-books/limit-order-type.enum';
import { LimitOrderStatus } from '../../api/models/orders/limit-order-status.enum';

@Component({
  selector: 'kt-limit-order-edit-dialog',
  templateUrl: './limit-order-edit.dialog.component.html',
  styleUrls: ['./limit-order-edit.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class LimitOrderEditDialogComponent implements OnInit, OnDestroy {

  assetPairId: string;
  types: LimitOrderType[] = [LimitOrderType.Sell, LimitOrderType.Buy];
  form: FormGroup;
  hasFormErrors = false;
  viewLoading = false;

  private componentSubscriptions: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LimitOrderEditDialogComponent>,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private limitOrdersService: LimitOrdersService,
    private layoutUtilsService: LayoutUtilsService) {
  }

  ngOnInit() {
    this.assetPairId = this.data.assetPairId;
    this.createForm();
  }

  ngOnDestroy() {
    if (this.componentSubscriptions) {
      this.componentSubscriptions.unsubscribe();
    }
  }

  createForm() {
    this.form = this.fb.group({
      walletId: [null, Validators.required],
      type: [null, Validators.required],
      price: [null, Validators.required],
      volume: [null, Validators.required],
      cancelPrevious: [false, Validators.required]
    });
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

    this.create(controls.walletId.value, controls.type.value, controls.price.value, controls.volume.value, controls.cancelPrevious.value);
  }

  create(walletId: string, type: LimitOrderType, price: number, volume: number, cancelPrevious: boolean) {
    this.viewLoading = true;
    this.limitOrdersService.create(this.assetPairId, walletId, type, price, volume, cancelPrevious)
      .subscribe(
        response => {
          this.viewLoading = false;

          if (response.status !== LimitOrderStatus.Ok) {
            this.layoutUtilsService.showActionNotification(`Can not create limit order: ${response.reason}`, MessageType.Update, 3000, true, false);
          }
          else {
            this.dialogRef.close({ limitOrderId: response.id, isEdit: true });
          }
        },
        error => {
          this.viewLoading = false;
          console.log('Limit order creation error', error);
          this.layoutUtilsService.showActionNotification('An error occurred while creating limit order.', MessageType.Update, 3000, true, false);
        }
      );
  }
}
