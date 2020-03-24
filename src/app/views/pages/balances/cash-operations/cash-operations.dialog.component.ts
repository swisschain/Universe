import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CashOperationType } from '../models/cash-operation-type';
import { Asset } from '../../../../api/models/asset.interface';
import { AssetsService } from '../../../../api/services/assets.service';
import { BalancesService } from '../../../../api/services/balances.service';
import { MessageType, LayoutUtilsService } from '../../../../core/_base/crud';

@Component({
  selector: 'kt-cash-operations.dialog',
  templateUrl: './cash-operations.dialog.component.html',
  styleUrls: ['./cash-operations.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CashOperationsDialogComponent implements OnInit, OnDestroy {

  private assetId: string;
  private operationType: CashOperationType;

  walletId: string;
  assets: Asset[];
  form: FormGroup;
  hasFormErrors = false;
  viewLoading = false;

  private componentSubscriptions: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CashOperationsDialogComponent>,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private assetsService: AssetsService,
    private balancesService: BalancesService,
    private layoutUtilsService: LayoutUtilsService) {
  }

  ngOnInit() {
    this.assetId = this.data.assetId;
    this.operationType = this.data.operationType;
    this.walletId = this.data.walletId;

    this.viewLoading = true;
    this.assetsService.getAll()
      .subscribe(response => {
        this.assets = response.items
        this.viewLoading = false;
        this.cd.markForCheck();
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
      assetId: [this.assetId, Validators.required],
      amount: [0, Validators.required]
    });
  }

  getTitle(): string {
    if (this.operationType === CashOperationType.CashIn) {
      return 'Cash-In amount';
    }

    return 'Cash-Out amount';
  }

  getButtonTitle(): string {
    if (this.operationType === CashOperationType.CashIn) {
      return 'Cash-In';
    }

    return 'Cash-Out';
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

    if (this.operationType === CashOperationType.CashIn) {
      this.cashIn(controls.assetId.value, controls.amount.value);
    } else {
      this.cashOut(controls.assetId.value, controls.amount.value);
    }
  }

  cashIn(assetId: string, amount: number) {
    this.viewLoading = true;
    this.balancesService.cashIn(this.walletId, assetId, amount)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ isEdit: true });
        },
        error => {
          this.viewLoading = false;
          console.log('Cash-In operation error', error);
          this.layoutUtilsService.showActionNotification('An error occurred while cash-in.', MessageType.Update, 3000, true, false);
        }
      );
  }

  cashOut(assetId: string, amount: number) {
    this.viewLoading = true;
    this.balancesService.cashOut(this.walletId, assetId, amount)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ isEdit: true });
        },
        error => {
          this.viewLoading = false;
          console.log('Cash-Out operation error', error);
          this.layoutUtilsService.showActionNotification('An error occurred while cash-out.', MessageType.Update, 3000, true, false);
        }
      );
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.form.controls[controlName];
    const result = control.invalid && control.touched;
    return result;
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }
}
