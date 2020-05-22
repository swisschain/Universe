import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

import { AssetService, AccountDataService } from '../../api/services';

import { BalanceDataSource } from '../../data-sources';

@Component({
  selector: 'kt-balance-total-list',
  templateUrl: './balance-total-list.component.html',
  styleUrls: ['./balance-total-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BalanceTotalListComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private assetService: AssetService,
    private accountDataService: AccountDataService) { }

  private accountId: number;
  private subscriptions: Subscription[] = [];

  searchByAssetInput = new FormControl();

  dataSource: BalanceDataSource;
  displayedColumns = ['asset', 'available', 'amount', 'reserved'];

  assets: string[] = [];
  filteredAssets: Observable<string[]>;

  asset = '';
  status = '';

  ngOnInit() {
    this.dataSource = new BalanceDataSource(this.accountDataService);

    const routeSubscription = this.route.params.subscribe(params => {
      this.accountId = params['accountId'];
      this.load();
    });

    this.subscriptions.push(routeSubscription);

    const searchByIdSubscription = this.searchByAssetInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.asset = value;
        this.load();
      });

    this.subscriptions.push(searchByIdSubscription);

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
    this.dataSource.load(this.accountId, null, this.asset);
  }

  loadAssets() {
    this.assetService.getAll()
      .subscribe(assets => {
        this.assets = assets.map(item => item.symbol);
      });
  }
}
