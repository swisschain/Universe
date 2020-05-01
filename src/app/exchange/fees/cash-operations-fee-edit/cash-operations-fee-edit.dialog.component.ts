import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { markFormGroupTouched, isFormGroupControlHasError } from '../../shared/utils/validation-utils'

import { Asset } from '../../api/models/assets';
import { CashOperationsFee, FeeType } from '../../api/models/fees';
import { FeeService } from '../../api/services';
import { AssetsService } from '../../api/assets.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'kt-cash-operations-fee-edit-dialog',
  templateUrl: './cash-operations-fee-edit.dialog.component.html',
  styleUrls: ['./cash-operations-fee-edit.dialog.component.scss']
})
export class CashOperationsFeeEditDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CashOperationsFeeEditDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private feeService: FeeService,
    private assetsService: AssetsService) {
  }

  private cashOperationsFee: CashOperationsFee;

  assets: string[];
  feeTypes = [FeeType.Absolute, FeeType.Percentage];

  cashOperationsFeeId: string;
  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  ngOnInit() {
    this.cashOperationsFeeId = this.data.cashOperationsFeeId;
    this.createForm();
    this.load();
  }

  load() {
    this.viewLoading = true;
    if (this.cashOperationsFeeId) {
      forkJoin([
        this.assetsService.getAll(),
        this.feeService.getById(this.cashOperationsFeeId),
        this.feeService.get(''),
      ])
        .subscribe(result => {
          this.cashOperationsFee = result[1].payload;
          this.setAssets(result[0], result[2].payload.items);
          this.addContents();
          this.viewLoading = false;
        });
    }
    else {
      forkJoin([
        this.assetsService.getAll(),
        this.feeService.get(''),
      ])
        .subscribe(result => {
          this.setAssets(result[0], result[1].payload.items);
          this.addContents();
          this.viewLoading = false;
        });
    }
  }

  setAssets(assets: Asset[], cashOperationsFees: CashOperationsFee[]) {
    const filteredAssets = [];

    if (this.cashOperationsFee) {
      filteredAssets.push(this.cashOperationsFee.asset);
    }

    assets.map(asset => asset.symbol)
      .filter(asset => !cashOperationsFees.filter(fee => fee.asset === asset)[0])
      .sort((a, b) => {
        if (a < b) { return -1; }
        if (a > b) { return 1; }
        return 0;
      })
      .forEach(asset => {
        filteredAssets.push(asset)
      });

    this.assets = filteredAssets;
  }

  createForm() {
    this.form = this.fb.group({
      asset: [{ value: '', disabled: this.cashOperationsFeeId ? true : false }, Validators.compose([
        Validators.required]
      )],
      cashInValue: [null, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(10000)]
      )],
      cashInFeeType: [null, Validators.compose([
        Validators.required]
      )],
      cashOutValue: [null, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(10000)]
      )],
      cashOutFeeType: [null, Validators.compose([
        Validators.required]
      )],
      cashTransferValue: [null, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(10000)]
      )],
      cashTransferFeeType: [null, Validators.compose([
        Validators.required]
      )],
    });
  }

  addContents() {
    if (this.cashOperationsFee) {
      this.form.controls.asset.setValue(this.cashOperationsFee.asset);
      this.form.controls.cashInValue.setValue(this.cashOperationsFee.cashInValue);
      this.form.controls.cashInFeeType.setValue(this.cashOperationsFee.cashInFeeType);
      this.form.controls.cashOutValue.setValue(this.cashOperationsFee.cashOutValue);
      this.form.controls.cashOutFeeType.setValue(this.cashOperationsFee.cashOutFeeType);
      this.form.controls.cashTransferValue.setValue(this.cashOperationsFee.cashTransferValue);
      this.form.controls.cashTransferFeeType.setValue(this.cashOperationsFee.cashTransferFeeType);
    }
  }

  getFeeTypeName(feeType: FeeType) {
    switch (feeType) {
      case FeeType.Absolute:
        return 'Absolute';
      case FeeType.Percentage:
        return 'Percentage';
      default:
        return '';
    }
  }

  onSubmit() {
    this.hasFormErrors = false;

    if (this.form.invalid) {
      markFormGroupTouched(this.form);
      return;
    }

    const cashTransferFeeType = this.prepare();

    if (cashTransferFeeType.id) {
      this.update(cashTransferFeeType);
    } else {
      this.create(cashTransferFeeType);
    }
  }

  private prepare(): CashOperationsFee {
    const controls = this.form.controls;
    return {
      id: this.cashOperationsFeeId,
      asset: controls.asset.value,
      cashInValue: controls.cashInValue.value,
      cashInFeeType: controls.cashInFeeType.value,
      cashOutValue: controls.cashOutValue.value,
      cashOutFeeType: controls.cashOutFeeType.value,
      cashTransferValue: controls.cashTransferValue.value,
      cashTransferFeeType: controls.cashTransferFeeType.value,
      created: null,
      modified: null
    };
  }

  private create(cashOperationsFee: CashOperationsFee) {
    this.viewLoading = true;
    this.feeService.create(cashOperationsFee)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ cashOperationsFee, isEdit: true });
        },
        errorResponse => {
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while creating cash operations fee';
          this.viewLoading = false;
          this.cdr.markForCheck();
        }
      );
  }

  private update(cashOperationsFee: CashOperationsFee) {
    this.viewLoading = true;
    this.feeService.update(cashOperationsFee)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ cashOperationsFee, isEdit: true });
        },
        errorResponse => {
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while updating cash operations fee';
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
