import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

import { AssetsService } from '../../api/assets.service';
import { AccountTradesDataSource } from '../../models/accounts-trades-data-source';
import { AccountDataService } from '../../api/account-data.service';

@Component({
  selector: 'kt-account-trade-list',
  templateUrl: './account-trade-list.component.html',
  styleUrls: ['./account-trade-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountTradeListComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private assetsService: AssetsService,
    private accountDataService: AccountDataService) { }

  private accountId: string;
  private subscriptions: Subscription[] = [];

  searchByBaseAssetInput = new FormControl();
  searchByQuotingAssetInput = new FormControl();

  assets: string[] = [];
  filteredBaseAssets: Observable<string[]>;
  filteredQuotingAssets: Observable<string[]>;

  dataSource: AccountTradesDataSource;
  displayedColumns = ['date', 'baseAsset', 'quotingAsset', 'price', 'baseVolume', 'quotingVolume'];

  baseAsset = '';
  quotingAsset = '';

  ngOnInit() {
    this.dataSource = new AccountTradesDataSource(this.accountDataService);

    const routeSubscription = this.route.params.subscribe(params => {
      this.accountId = params['accountId'];
      this.load();
    });

    this.subscriptions.push(routeSubscription);

    const searchByBaseAssetSubscription = this.searchByBaseAssetInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.baseAsset = value;
        this.load();
      });
    this.subscriptions.push(searchByBaseAssetSubscription);

    const searchByQuotingAssetSubscription = this.searchByQuotingAssetInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.quotingAsset = value;
        this.load();
      });
    this.subscriptions.push(searchByQuotingAssetSubscription);

    this.filteredBaseAssets = this.searchByBaseAssetInput.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          const filterValue = value.toLowerCase();
          return this.assets.filter(asset => asset.toLowerCase().includes(filterValue));
        })
      );

    this.filteredQuotingAssets = this.searchByQuotingAssetInput.valueChanges
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
    this.dataSource.load(this.accountId, this.baseAsset, this.quotingAsset);
  }

  loadAssets() {
    this.assetsService.getAll()
      .subscribe(assets => {
        this.assets = assets.map(item => item.symbol);
      });
  }
}
