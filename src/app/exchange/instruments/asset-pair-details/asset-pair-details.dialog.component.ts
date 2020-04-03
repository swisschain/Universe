import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { AssetPair } from '../../api/models/asset-pairs/asset-pair.interface';

@Component({
  selector: 'kt-asset-pair-details-dialog',
  templateUrl: './asset-pair-details.dialog.component.html',
  styleUrls: ['./asset-pair-details.dialog.component.scss']
})
export class AssetPairDetailsDialogComponent implements OnInit, OnDestroy {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AssetPairDetailsDialogComponent>) {
  }

  private subscriptions: Subscription;

  viewLoading = false;
  assetPair: AssetPair;

  ngOnInit() {
    this.assetPair = this.data.assetPair;
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

}
