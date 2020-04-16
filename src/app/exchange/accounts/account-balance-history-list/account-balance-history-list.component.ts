import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

import { AssetsService } from '../../api/assets.service';
import { AccountBalanceHistoryDataSource } from '../../models/accounts-balance-history-data-source';
import { AccountDataService } from '../../api/account-data.service';

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
    private assetsService: AssetsService,
    private accountDataService: AccountDataService) { }

  private accountId: string;
  private subscriptions: Subscription[] = [];

  searchByAssetInput = new FormControl();

  assets: string[] = [];
  filteredAssets: Observable<string[]>;

  dataSource: AccountBalanceHistoryDataSource;
  displayedColumns = ['asset', 'balance', 'oldBalance', 'reserved', 'oldReserved', 'date'];

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
    this.dataSource.load(this.accountId, this.asset);
  }

  loadAssets() {
    this.assetsService.getAll()
      .subscribe(assets => {
        this.assets = assets.map(item => item.symbol);
      });
  }
}
