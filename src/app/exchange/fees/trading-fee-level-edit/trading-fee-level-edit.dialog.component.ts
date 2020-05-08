import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { markFormGroupTouched, isFormGroupControlHasError } from '../../shared/utils/validation-utils'

import { TradingFeeLevel } from '../../api/models/fees';
import { TradingFeeService } from '../../api/services';

@Component({
  selector: 'kt-trading-fee-level-edit-dialog',
  templateUrl: './trading-fee-level-edit.dialog.component.html',
  styleUrls: ['./trading-fee-level-edit.dialog.component.scss']
})
export class TradingFeeLevelEditDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TradingFeeLevelEditDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private tradingFeeService: TradingFeeService) {
  }

  tradingFeeId: string;
  tradingFeeLevel: TradingFeeLevel;
  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  ngOnInit() {
    this.tradingFeeId = this.data.tradingFeeId;
    this.tradingFeeLevel = this.data.tradingFeeLevel;
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      volume: [this.tradingFeeLevel ? this.tradingFeeLevel.volume : null, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(10000)]
      )],
      makerFee: [this.tradingFeeLevel ? this.tradingFeeLevel.makerFee : null, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(10000)]
      )],
      takerFee: [this.tradingFeeLevel ? this.tradingFeeLevel.takerFee : null, Validators.compose([
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

    const tradingFeeLevel = this.prepare();
    if (tradingFeeLevel.id) {
      this.update(tradingFeeLevel);
    } else {
      this.create(tradingFeeLevel);
    }
  }

  prepare(): TradingFeeLevel {
    const controls = this.form.controls;

    return {
      id: this.tradingFeeLevel ? this.tradingFeeLevel.id : null,
      tradingFeeId: this.tradingFeeId,
      volume: controls.volume.value,
      makerFee: controls.makerFee.value,
      takerFee: controls.takerFee.value,
      created: null,
      modified: null
    };
  }

  create(tradingFeeLevel: TradingFeeLevel) {
    this.viewLoading = true;
    this.tradingFeeService.addLevel(tradingFeeLevel)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ tradingFeeLevel, isEdit: true });
        },
        error => {
          this.viewLoading = false;
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while creating trading fee level.';
          this.cdr.markForCheck();
        }
      );
  }

  update(tradingFeeLevel: TradingFeeLevel) {
    this.viewLoading = true;
    this.tradingFeeService.updateLevel(tradingFeeLevel)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ tradingFeeLevel, isEdit: true });
        },
        error => {
          this.viewLoading = false;
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while updating trading fee level.';
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
