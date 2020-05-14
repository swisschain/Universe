import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Asset } from '../../api/models/assets';
import { AssetService } from '../../api/services';

@Component({
  selector: 'kt-asset-edit-dialog',
  templateUrl: './asset-edit.dialog.component.html',
  styleUrls: ['./asset-edit.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AssetEditDialogComponent implements OnInit, OnDestroy {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AssetEditDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private assetService: AssetService) {
  }

  asset: Asset;
  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  ngOnInit() {
    this.asset = this.data.asset;
    this.createForm();
  }

  ngOnDestroy() {
  }

  createForm() {
    this.form = this.fb.group({
      symbol: [{ value: this.asset.symbol, disabled: this.asset.symbol ? true : false }, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(36)]
      )],
      accuracy: [this.asset.accuracy, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(8)]
      )],
      description: [this.asset.description, Validators.compose([
        Validators.maxLength(500)]
      )],
      isDisabled: [this.asset.isDisabled, Validators.required]
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

    const asset = this.prepare();
    if (this.asset.symbol) {
      this.update(asset);
    } else {
      this.create(asset);
    }
  }

  prepare(): Asset {
    const controls = this.form.controls;

    const asset: Asset = {
      symbol: controls.symbol.value,
      description: controls.description.value,
      accuracy: controls.accuracy.value,
      isDisabled: controls.isDisabled.value,
      created: null,
      modified: null,
    };

    return asset;
  }

  create(asset: Asset) {
    this.viewLoading = true;
    this.assetService.add(asset)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ asset, isEdit: true });
        },
        error => {
          this.viewLoading = false;
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while adding asset.';
          this.cdr.markForCheck();
        }
      );
  }

  update(asset: Asset) {
    this.viewLoading = true;
    this.assetService.update(asset)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ asset, isEdit: true });
        },
        error => {
          this.viewLoading = false;
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while updating asset.';
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
