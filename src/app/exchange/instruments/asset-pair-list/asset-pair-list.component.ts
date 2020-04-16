import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { AssetPair } from '../../api/models/asset-pairs/asset-pair.interface';
import { AssetPairsService } from '../../api/asset-pairs.service';
import { AssetsService } from '../../api/assets.service';

import { AssetPairsDataSource } from '../../models/asset-pairs-data-source';
import { AssetPairEditDialogComponent } from '../asset-pair-edit/asset-pair-edit.dialog.component';
import { AssetPairDetailsDialogComponent } from '../asset-pair-details/asset-pair-details.dialog.component';

@Component({
  selector: 'kt-asset-pair-list',
  templateUrl: './asset-pair-list.component.html',
  styleUrls: ['./asset-pair-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetPairListComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private assetsService: AssetsService,
    private assetPairsService: AssetPairsService) { }

  private subscriptions: Subscription[] = [];

  searchBySymbolInput = new FormControl();
  searchByBaseAssetSymbolInput = new FormControl();
  searchByQuotingAssetSymbolInput = new FormControl();

  assetSymbols: string[] = [];
  assetPairSymbols: string[] = [];
  filteredAssetPairSymbols: Observable<string[]>;
  filteredBaseAssetSymbols: Observable<string[]>;
  filteredQuotingAssetSymbols: Observable<string[]>;

  dataSource: AssetPairsDataSource;
  displayedColumns = ['symbol', 'baseAsset', 'quotingAsset', 'accuracy', 'minVolume', 'maxVolume', 'maxOppositeVolume', 'marketOrderPriceThreshold', 'isDisabled', 'created', 'modified', 'actions'];

  assetPairSymbol = '';
  baseAssetSymbol = '';
  quotingAssetSymbol = '';
  status = '';

  ngOnInit() {

    this.dataSource = new AssetPairsDataSource(this.assetPairsService);

    const searchBySymbolSubscription = this.searchBySymbolInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.assetPairSymbol = value;
        this.load();
      });
    this.subscriptions.push(searchBySymbolSubscription);

    const searchByBaseAssetSymbolSubscription = this.searchByBaseAssetSymbolInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.baseAssetSymbol = value;
        this.load();
      });
    this.subscriptions.push(searchByBaseAssetSymbolSubscription);

    const searchByQuotingAssetSymbolSubscription = this.searchByQuotingAssetSymbolInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.quotingAssetSymbol = value;
        this.load();
      });
    this.subscriptions.push(searchByQuotingAssetSymbolSubscription);

    this.filteredAssetPairSymbols = this.searchBySymbolInput.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          const filterValue = value.toLowerCase();
          return this.assetPairSymbols.filter(assetPairSymbol => assetPairSymbol.toLowerCase().includes(filterValue));
        })
      );

    this.filteredBaseAssetSymbols = this.searchByBaseAssetSymbolInput.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          const filterValue = value.toLowerCase();
          return this.assetSymbols.filter(assetSymbol => assetSymbol.toLowerCase().includes(filterValue));
        })
      );

    this.filteredQuotingAssetSymbols = this.searchByQuotingAssetSymbolInput.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          const filterValue = value.toLowerCase();
          return this.assetSymbols.filter(assetSymbol => assetSymbol.toLowerCase().includes(filterValue));
        })
      );

    this.load();
    this.loadAssets();
    this.loadAssetPairs();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    const isDisabled = this.status === 'enabled' ? false : this.status === 'disabled' ? true : null;
    this.dataSource.load(this.assetPairSymbol, this.baseAssetSymbol, this.quotingAssetSymbol, isDisabled);
  }

  loadAssets() {
    this.assetsService.getAll()
      .subscribe(assets => {
        this.assetSymbols = assets.map(item => item.symbol);
      });
  }

  loadAssetPairs() {
    this.assetPairsService.getAll()
      .subscribe(assetPairs => {
        this.assetPairSymbols = assetPairs.map(item => item.symbol);
      });
  }

  details(assetPair: AssetPair) {
    this.dialog.open(AssetPairDetailsDialogComponent, { data: { assetPair }, width: '700px' });
  }

  add() {
    const assetPair: AssetPair = {
      symbol: null,
      baseAsset: null,
      quotingAsset: null,
      accuracy: 0,
      minVolume: 0,
      maxVolume: 0,
      maxOppositeVolume: 0,
      marketOrderPriceThreshold: 0,
      isDisabled: false,
      created: null,
      modified: null
    };

    this.edit(assetPair);
  }

  edit(assetPair: AssetPair) {
    const saveMessage = assetPair.symbol ? 'Asset pair updated' : 'Asset pair added';
    const messageType = assetPair.symbol ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(AssetPairEditDialogComponent, { data: { assetPair } });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(saveMessage, messageType, 1000, true, false);
      this.load();
    });
  }

  delete(assetPair: AssetPair) {
    const dialogRef = this.layoutUtilsService.deleteElement('Asset Pair Delete', 'Are you sure to permanently delete this asset pair?', 'Asset  pair is deleting...');
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.assetPairsService.delete(assetPair.symbol)
          .subscribe(
            response => {
              this.layoutUtilsService.showActionNotification('Asset pair has been deleted.', MessageType.Delete, 3000, true, false);
              this.load();
            },
            error => {
              this.layoutUtilsService.showActionNotification('An error occurred while deleting asset pair.', MessageType.Update, 3000, true, false);
            }
          );
      });
  }
}
