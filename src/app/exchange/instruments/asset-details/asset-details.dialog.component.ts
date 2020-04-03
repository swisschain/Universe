import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { Asset } from '../../api/models/assets/asset.interface';

@Component({
  selector: 'kt-asset-details',
  templateUrl: './asset-details.dialog.component.html',
  styleUrls: ['./asset-details.dialog.component.scss']
})
export class AssetDetailsDialogComponent implements OnInit, OnDestroy {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AssetDetailsDialogComponent>) {
  }

  private subscriptions: Subscription;

  viewLoading = false;
  asset: Asset;

  ngOnInit() {
    this.asset = this.data.asset;
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
