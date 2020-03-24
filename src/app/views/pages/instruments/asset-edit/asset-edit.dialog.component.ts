import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Asset } from '../../../../api/models/asset.interface';
import { AssetsService } from '../../../../api/services/assets.service';
import { MessageType, LayoutUtilsService } from '../../../../core/_base/crud';

@Component({
  selector: 'kt-asset-edit',
  templateUrl: './asset-edit.dialog.component.html',
  styleUrls: ['./asset-edit.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AssetEditDialogComponent implements OnInit, OnDestroy {

  asset: Asset;
  form: FormGroup;
  hasFormErrors = false;
  viewLoading = false;

  private componentSubscriptions: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AssetEditDialogComponent>,
    private fb: FormBuilder,
    private assetsService: AssetsService,
    private layoutUtilsService: LayoutUtilsService) {
  }

  ngOnInit() {
    this.asset = this.data.asset;
    this.createForm();
  }

  ngOnDestroy() {
    if (this.componentSubscriptions) {
      this.componentSubscriptions.unsubscribe();
    }
  }

  createForm() {
    this.form = this.fb.group({
      name: [this.asset.name, Validators.required],
      description: [this.asset.description, Validators.required],
      accuracy: [this.asset.accuracy, Validators.required],
      isDisabled: [this.asset.isDisabled, Validators.required]
    });
  }

  getTitle(): string {
    if (this.asset.id) {
      return 'Edit asset';
    }

    return 'New asset';
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

    const asset = this.prepare();
    if (this.asset.id) {
      this.update(asset);
    } else {
      this.create(asset);
    }
  }

  prepare(): Asset {
    const controls = this.form.controls;

    const asset: Asset = {
      id: this.asset.id,
      name: controls.name.value,
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
    this.assetsService.add(asset)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ asset, isEdit: true });
        },
        error => {
          this.viewLoading = false;
          console.log('Asset adding error', error);
          this.layoutUtilsService.showActionNotification('An error occurred while adding asset.', MessageType.Update, 3000, true, false);
        }
      );
  }

  update(asset: Asset) {
    this.viewLoading = true;
    this.assetsService.update(asset)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ asset, isEdit: true });
        },
        error => {
          this.viewLoading = false;
          console.log('Asset update error', error);
          this.layoutUtilsService.showActionNotification('An error occurred while updating asset.', MessageType.Update, 3000, true, false);
        }
      );
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }
}
