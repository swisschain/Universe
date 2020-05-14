import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';

import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';

import { getBalanceHistoryTypeTitle } from '../../shared/utils'

import { BalanceHistory, BalanceHistoryType } from '../../api/models/balances';
import { AssetService, AccountDataService } from '../../api/services';

import { AccountBalanceHistoryDataSource } from '../../data-sources';

import { BalanceHistoryDetailsDialogComponent } from '../balance-history-details/balance-history-details.dialog.component';

@Component({
  selector: 'kt-account-balance-history-list',
  templateUrl: './account-balance-history-list.component.html',
  styleUrls: ['./account-balance-history-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountBalanceHistoryListComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private assetService: AssetService,
    private accountDataService: AccountDataService) { }

  private accountId: string;
  private subscriptions: Subscription[] = [];

  searchByAssetInput = new FormControl();

  assets: string[] = [];
  filteredAssets: Observable<string[]>;

  dataSource: AccountBalanceHistoryDataSource;
  displayedColumns = ['asset', 'balance', 'oldBalance', 'reserved', 'oldReserved', 'type', 'date', 'actions'];
  balanceHistoryTypes = [BalanceHistoryType.CashIn, BalanceHistoryType.CashOut, BalanceHistoryType.CashTransfer, BalanceHistoryType.Order, BalanceHistoryType.ReservedBalanceUpdate];

  type: BalanceHistoryType = null;
  asset = '';

  ngOnInit() {
    this.dataSource = new AccountBalanceHistoryDataSource(this.accountDataService);

    const routeSubscription = this.route.params.subscribe(params => {
      this.accountId = params['accountId'];
      this.load();
    });

    this.subscriptions.push(routeSubscription);

    const searchByAssetSubscription = this.searchByAssetInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.asset = value;
        this.load();
      });
    this.subscriptions.push(searchByAssetSubscription);

    this.filteredAssets = this.searchByAssetInput.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          const filterValue = value.toLowerCase();
          return this.assets.filter(asset => asset.toLowerCase().includes(filterValue));
        })
      );

    this.loadAssets();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load(this.accountId, this.asset, this.type);
  }

  loadAssets() {
    this.assetService.getAll()
      .subscribe(assets => {
        this.assets = assets.map(item => item.symbol);
      });
  }

  getTypeTitle(balanceHistoryType: BalanceHistoryType) {
    return getBalanceHistoryTypeTitle(balanceHistoryType);
  }

  details(balanceHistory: BalanceHistory) {
    this.dialog.open(BalanceHistoryDetailsDialogComponent, { data: { balanceHistoryId: balanceHistory.id }, width: '700px' });
  }
}
