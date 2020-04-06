import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap, skip, delay, take, catchError, finalize } from 'rxjs/operators';
import { fromEvent, merge, Subscription, of } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { BrokerAccountService } from '../../api/broker-account.service';
import { BrokerAccountBalancesDataSource } from '../../models/broker-account-balances-data-source';
import { Asset } from '../../api/models/assets/asset.interface';
import { AssetsService } from '../../api/assets.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kt-broker-account-balances',
  templateUrl: './broker-account-balances.component.html',
  styleUrls: ['./broker-account-balances.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrokerAccountBalancesComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private assetsService: AssetsService,
    private brokerAccountService: BrokerAccountService) { }

  private subscriptions: Subscription[] = [];
  private brokerAccountId: number;
  private assets: Asset[];

  dataSource: BrokerAccountBalancesDataSource;
  displayedColumns = ['assetId', 'pendingBalance', 'ownedBalance', 'availableBalance', 'reservedBalance', 'pendingBalanceUpdateDateTime', 'ownedBalanceUpdateDateTime', 'availableBalanceUpdateDateTime', 'reservedBalanceUpdateDateTime'];

  ngOnInit() {
    this.dataSource = new BrokerAccountBalancesDataSource(this.brokerAccountService);

    const routeSub = this.route.params.subscribe(params => {
      this.brokerAccountId = params['brokerAccountId'];
      this.load();
    });

    this.subscriptions.push(routeSub);

    this.load();
    this.loadAssets();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load(this.brokerAccountId);
  }

  loadAssets() {
    this.assetsService.getAll()
      .subscribe(assets => {
        this.assets = assets.items;
        this.changeDetector.markForCheck();
      });
  }

  getAssetName(assetId: number) {
    if (this.assets) {
      var asset = this.assets.filter((asset) => asset.assetId == assetId)[0];

      return asset ? asset.symbol : 'unknown';
    }

    return '';
  }
}
