import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Asset } from '../../api/models/assets';
import { AssetPair } from '../../api/models/asset-pairs';
import { AssetService, AssetPairService } from '../../api/services';

@Component({
  selector: 'kt-asset-pair-edit',
  templateUrl: './asset-pair-edit.dialog.component.html',
  styleUrls: ['./asset-pair-edit.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AssetPairEditDialogComponent implements OnInit, OnDestroy {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AssetPairEditDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private assetService: AssetService,
    private assetPairService: AssetPairService) {
  }

  assetPair: AssetPair;
  assets: Asset[];
  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  ngOnInit() {
    this.assetPair = this.data.assetPair;
    this.viewLoading = true;
    this.assetService.getAll()
      .subscribe(assets => {
        this.assets = assets
        this.viewLoading = false;
        this.cdr.markForCheck();
      });
    this.createForm();
  }

  ngOnDestroy() {
  }

  createForm() {
    this.form = this.fb.group({
      symbol: [{ value: this.assetPair.symbol, disabled: this.assetPair.symbol ? true : false }, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(36)]
      )],
      baseAsset: [{ value: this.assetPair.baseAsset, disabled: this.assetPair.symbol ? true : false }, Validators.required],
      quotingAsset: [{ value: this.assetPair.quotingAsset, disabled: this.assetPair.symbol ? true : false }, Validators.required],
      accuracy: [this.assetPair.accuracy, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(8)]
      )],
      minVolume: [this.assetPair.minVolume, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(10000)]
      )],
      maxVolume: [this.assetPair.maxVolume, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(10000)]
      )],
      maxOppositeVolume: [this.assetPair.maxOppositeVolume, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(10000)]
      )],
      marketOrderPriceThreshold: [this.assetPair.marketOrderPriceThreshold, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(10000)]
      )],
      isDisabled: [this.assetPair.isDisabled, Validators.required]
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

    const assetPair = this.prepare();
    if (this.assetPair.symbol) {
      this.update(assetPair);
    } else {
      this.create(assetPair);
    }
  }

  prepare(): AssetPair {
    const controls = this.form.controls;

    const assetPair: AssetPair = {
      symbol: controls.symbol.value,
      baseAsset: controls.baseAsset.value,
      quotingAsset: controls.quotingAsset.value,
      accuracy: controls.accuracy.value,
      minVolume: controls.minVolume.value,
      maxVolume: controls.maxVolume.value,
      maxOppositeVolume: controls.maxOppositeVolume.value,
      marketOrderPriceThreshold: controls.marketOrderPriceThreshold.value,
      isDisabled: controls.isDisabled.value,
      created: null,
      modified: null
    };

    return assetPair;
  }

  create(assetPair: AssetPair) {
    this.viewLoading = true;
    this.assetPairService.add(assetPair)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ assetPair, isEdit: true });
        },
        error => {
          this.viewLoading = false;
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while creating asset pair.';
          this.cdr.markForCheck();
        }
      );
  }

  update(assetPair: AssetPair) {
    this.viewLoading = true;
    this.assetPairService.update(assetPair)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ assetPair, isEdit: true });
        },
        error => {
          this.viewLoading = false;
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while updating asset pair.';
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
