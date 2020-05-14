import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { markFormGroupTouched, isFormGroupControlHasError } from '../../shared/utils/validation-utils'

import { Asset } from '../../api/models/assets';
import { AssetPair } from '../../api/models/asset-pairs';
import { TradingFee } from '../../api/models/fees';
import { AssetService, AssetPairService, TradingFeeService } from '../../api/services';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'kt-trading-fee-edit-dialog',
  templateUrl: './trading-fee-edit.dialog.component.html',
  styleUrls: ['./trading-fee-edit.dialog.component.scss']
})
export class TradingFeeEditDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TradingFeeEditDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private tradingFeeService: TradingFeeService,
    private assetService: AssetService,
    private assetPairService: AssetPairService) {
  }

  private tradingFee: TradingFee;

  assets: string[];
  assetPairs: string[];

  tradingFeeId: string;
  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  ngOnInit() {
    this.tradingFeeId = this.data.tradingFeeId;
    this.createForm();
    this.load();
  }

  load() {
    this.viewLoading = true;
    if (this.tradingFeeId) {
      forkJoin([
        this.assetService.getAll(),
        this.assetPairService.getAll(),
        this.tradingFeeService.get(''),
        this.tradingFeeService.getById(this.tradingFeeId)
      ])
        .subscribe(result => {
          this.tradingFee = result[3].payload;
          this.setData(result[0], result[1], result[2].payload.items);
          this.addContents();
          this.viewLoading = false;
        });
    }
    else {
      forkJoin([
        this.assetService.getAll(),
        this.assetPairService.getAll(),
        this.tradingFeeService.get(''),
      ])
        .subscribe(result => {
          this.setData(result[0], result[1], result[2].payload.items);
          this.addContents();
          this.viewLoading = false;
        });
    }
  }

  setData(assets: Asset[], assetPairs: AssetPair[], tradingFees: TradingFee[]) {
    const filteredAssetPairs = [];

    if (this.tradingFee) {
      if (this.tradingFee.assetPair) {
        filteredAssetPairs.push(this.tradingFee.assetPair);
      }
    }

    this.assets = assets.map(asset => asset.symbol);

    assetPairs.map(assetPair => assetPair.symbol)
      .filter(assetPair => !tradingFees.filter(fee => fee.assetPair === assetPair)[0])
      .sort((a, b) => {
        if (a < b) { return -1; }
        if (a > b) { return 1; }
        return 0;
      })
      .forEach(assetPair => {
        filteredAssetPairs.push(assetPair)
      });

    this.assetPairs = filteredAssetPairs;
  }

  createForm() {
    this.form = this.fb.group({
      assetPair: [{ value: '', disabled: this.tradingFeeId ? true : false }, Validators.compose([
        Validators.required]
      )],
      asset: ['', Validators.compose([
      ]
      )],
    });
  }

  addContents() {
    if (this.tradingFee) {
      this.form.controls.assetPair.setValue(this.tradingFee.assetPair);
      this.form.controls.asset.setValue(this.tradingFee.asset);
    }
  }

  onSubmit() {
    this.hasFormErrors = false;

    if (this.form.invalid) {
      markFormGroupTouched(this.form);
      return;
    }

    const tradingFee = this.prepare();

    if (tradingFee.id) {
      this.update(tradingFee);
    } else {
      this.create(tradingFee);
    }
  }

  private prepare(): TradingFee {
    const controls = this.form.controls;
    return {
      id: this.tradingFeeId,
      assetPair: controls.assetPair.value ? controls.assetPair.value : null,
      asset: controls.asset.value ? controls.asset.value : null,
      created: null,
      modified: null
    };
  }

  private create(tradingFee: TradingFee) {
    this.viewLoading = true;
    this.tradingFeeService.create(tradingFee)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ tradingFee, isEdit: true });
        },
        errorResponse => {
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while creating trading fee';
          this.viewLoading = false;
          this.cdr.markForCheck();
        }
      );
  }

  private update(tradingFee: TradingFee) {
    this.viewLoading = true;
    this.tradingFeeService.update(tradingFee)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ tradingFee, isEdit: true });
        },
        errorResponse => {
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while updating trading fee';
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
