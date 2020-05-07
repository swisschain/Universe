import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

import { getHistoryTypeTitle } from '../../shared/utils'
import { FeeType, OperationType } from '../../api/models/fees';

import { AssetsService } from '../../api/assets.service';
import { FeeHistoryService } from '../../api/services';

import { CashOperationsFeeHistoryDataSource } from '../../data-sources';

@Component({
  selector: 'kt-cash-operations-fee-history',
  templateUrl: './cash-operations-fee-history.component.html',
  styleUrls: ['./cash-operations-fee-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashOperationsFeeHistoryComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private assetsService: AssetsService,
    private feeHistoryService: FeeHistoryService) { }

  private subscriptions: Subscription[] = [];

  searchByAssetInput = new FormControl();

  assets: string[] = [];
  filteredAssets: Observable<string[]>;

  dataSource: CashOperationsFeeHistoryDataSource;
  displayedColumns = ['asset', 'cashIn', 'cashOut', 'transfer', 'operationType', 'timestamp'];

  asset = '';

  ngOnInit() {
    this.dataSource = new CashOperationsFeeHistoryDataSource(this.feeHistoryService);

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

    this.load();
    this.loadAssets();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load(this.asset);
  }

  loadAssets() {
    this.assetsService.getAll()
      .subscribe(assets => {
        this.assets = assets.map(item => item.symbol);
      });
  }

  isPercentage(feeType: FeeType) {
    return feeType === FeeType.Percentage;
  }

  getOperationTypeTitle(operationType: OperationType) {
    return getHistoryTypeTitle(operationType);
  }
}
