import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { Asset } from '../../api/models/assets/asset.interface';
import { BlockchainsService } from '../../api/blockchains.service';
import { AccountService } from '../../api/account.service';
import { BrokerAccountService } from '../../api/broker-account.service';

@Component({
  selector: 'kt-asset-requisites-dialog',
  templateUrl: './asset-requisites.dialog.component.html',
  styleUrls: ['./asset-requisites.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AssetRequisitesDialogComponent implements OnInit, OnDestroy {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AssetRequisitesDialogComponent>,
    private changeDetector: ChangeDetectorRef,
    private blockchainsService: BlockchainsService,
    private accountsService: AccountService,
    private brokerAccountsService: BrokerAccountService) {
  }

  private subscriptions: Subscription;
  private accountId: number = null;
  private brokerAccountId: number = null;
  private loaders = 0;

  viewLoading = false;

  asset: Asset;
  blockchainName = '';
  address = '';
  tagLable = 'Tag';
  tagTypeLable = 'Tag Type';
  tag = '';
  tagType = '';

  ngOnInit() {
    this.asset = this.data.asset;
    this.accountId = this.data.accountId;
    this.brokerAccountId = this.data.brokerAccountId;

    this.load();
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  load() {
    this.viewLoading = true;
    this.loaders++;

    if (this.accountId) {
      this.accountsService.getRequisites(this.accountId, this.asset.assetId)
        .subscribe(requisites => {
          this.address = requisites.address;
          this.tag = requisites.tag;
          this.tagType = requisites.tagType;
          this.releaseLoader();
          this.changeDetector.markForCheck();
        });
    } else if (this.brokerAccountId) {
      this.brokerAccountsService.getRequisites(this.brokerAccountId, this.asset.assetId)
        .subscribe(requisites => {
          this.address = requisites.address;
          this.releaseLoader();
          this.changeDetector.markForCheck();
        });
    }

    this.loaders++;

    this.blockchainsService.getById(this.asset.blockchainId)
      .subscribe(blockchain => {
        this.blockchainName = blockchain.name;
        this.releaseLoader();
      });
  }

  releaseLoader() {
    this.loaders--;
    this.viewLoading = this.loaders > 0;
  }
}
