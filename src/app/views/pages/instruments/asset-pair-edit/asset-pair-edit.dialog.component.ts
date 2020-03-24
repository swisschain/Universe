import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Asset } from '../../../../api/models/asset.interface';
import { AssetPair } from '../../../../api/models/asset-pair.interface';
import { AssetsService } from '../../../../api/services/assets.service';
import { AssetPairsService } from '../../../../api/services/asset-pairs.service';
import { MessageType, LayoutUtilsService } from '../../../../core/_base/crud';

@Component({
  selector: 'kt-asset-pair-edit',
  templateUrl: './asset-pair-edit.dialog.component.html',
  styleUrls: ['./asset-pair-edit.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AssetPairEditDialogComponent implements OnInit, OnDestroy {

  assetPair: AssetPair;
  assets: Asset[];
  form: FormGroup;
  hasFormErrors = false;
  viewLoading = false;

  private componentSubscriptions: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AssetPairEditDialogComponent>,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private assetsService: AssetsService,
    private assetPairsService: AssetPairsService,
    private layoutUtilsService: LayoutUtilsService) {
  }

  ngOnInit() {
    this.assetPair = this.data.assetPair;
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
      name: [this.assetPair.name, Validators.required],
      baseAssetId: [this.assetPair.baseAssetId, Validators.required],
      quotingAssetId: [this.assetPair.quotingAssetId, Validators.required],
      accuracy: [this.assetPair.accuracy, Validators.required],
      minVolume: [this.assetPair.minVolume, Validators.required],
      maxVolume: [this.assetPair.maxVolume, Validators.required],
      maxOppositeVolume: [this.assetPair.maxOppositeVolume, Validators.required],
      marketOrderPriceThreshold: [this.assetPair.marketOrderPriceThreshold, Validators.required],
      isDisabled: [this.assetPair.isDisabled, Validators.required]
    });
  }

  getTitle(): string {
    if (this.assetPair.id) {
      return 'Edit asset pair';
    }

    return 'New asset pair';
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

    const assetPair = this.prepare();
    if (assetPair.id) {
      this.update(assetPair);
    } else {
      this.create(assetPair);
    }
  }

  prepare(): AssetPair {
    const controls = this.form.controls;

    const assetPair: AssetPair = {
      id: this.assetPair.id,
      name: controls.name.value,
      baseAssetId: controls.baseAssetId.value,
      quotingAssetId: controls.quotingAssetId.value,
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
    this.assetPairsService.add(assetPair)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ assetPair, isEdit: true });
        },
        error => {
          this.viewLoading = false;
          console.log('Asset pair adding error', error);
          this.layoutUtilsService.showActionNotification('An error occurred while adding asset pair.', MessageType.Update, 3000, true, false);
        }
      );
  }

  update(assetPair: AssetPair) {
    this.viewLoading = true;
    this.assetPairsService.update(assetPair)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ assetPair, isEdit: true });
        },
        error => {
          this.viewLoading = false;
          console.log('Asset pair update error', error);
          this.layoutUtilsService.showActionNotification('An error occurred while updating asset pair.', MessageType.Update, 3000, true, false);
        }
      );
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }
}
