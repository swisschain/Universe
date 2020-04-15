import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap, skip, delay, take, catchError, finalize, map, startWith } from 'rxjs/operators';
import { fromEvent, merge, Subscription, of, Observable } from 'rxjs';
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
export class AssetPairListComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private assetsService: AssetsService,
    private assetPairsService: AssetPairsService) { }

  private subscriptions: Subscription[] = [];

  searchByIdInput = new FormControl();
  searchByBaseAssetIdInput = new FormControl();
  searchByQuotingAssetIdInput = new FormControl();

  assetIds: string[] = [];
  assetPairIds: string[] = [];
  filteredAssetPairIds: Observable<string[]>;
  filteredBaseAssetIds: Observable<string[]>;
  filteredQuotingAssetIds: Observable<string[]>;

  dataSource: AssetPairsDataSource;
  displayedColumns = ['assetPairId', 'name', 'baseAssetId', 'quotingAssetId', 'accuracy', 'minVolume', 'maxVolume', 'maxOppositeVolume', 'marketOrderPriceThreshold', 'isDisabled', 'created', 'modified', 'actions'];

  assetPairId = '';
  baseAssetId = '';
  quotingAssetId = '';
  status = '';

  ngOnInit() {

    this.dataSource = new AssetPairsDataSource(this.assetPairsService);

    const searchByIdSubscription = this.searchByIdInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.assetPairId = value;
        this.load();
      });
    this.subscriptions.push(searchByIdSubscription);

    const searchByBaseAssetIdSubscription = this.searchByBaseAssetIdInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.baseAssetId = value;
        this.load();
      });
    this.subscriptions.push(searchByBaseAssetIdSubscription);

    const searchByQuotingAssetIdSubscription = this.searchByQuotingAssetIdInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.quotingAssetId = value;
        this.load();
      });
    this.subscriptions.push(searchByQuotingAssetIdSubscription);

    this.filteredAssetPairIds = this.searchByIdInput.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          const filterValue = value.toLowerCase();
          return this.assetPairIds.filter(assetPairId => assetPairId.toLowerCase().includes(filterValue));
        })
      );

    this.filteredBaseAssetIds = this.searchByBaseAssetIdInput.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          const filterValue = value.toLowerCase();
          return this.assetIds.filter(assetId => assetId.toLowerCase().includes(filterValue));
        })
      );

    this.filteredQuotingAssetIds = this.searchByQuotingAssetIdInput.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          const filterValue = value.toLowerCase();
          return this.assetIds.filter(assetId => assetId.toLowerCase().includes(filterValue));
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
    const status = this.status === 'enabled' ? true : this.status === 'disabled' ? false : null;
    this.dataSource.load(this.assetPairId, this.baseAssetId, this.quotingAssetId, status);
  }

  loadAssets() {
    this.assetsService.getAll()
      .subscribe(assets => {
        this.assetIds = assets.map(item => item.id);
      });
  }

  loadAssetPairs() {
    this.assetPairsService.getAll()
      .subscribe(assetPairs => {
        this.assetPairIds = assetPairs.map(item => item.id);
      });
  }

  details(assetPair: AssetPair) {
    this.dialog.open(AssetPairDetailsDialogComponent, { data: { assetPair }, width: '700px' });
  }

  add() {
    const assetPair: AssetPair = {
      id: null,
      name: null,
      baseAssetId: null,
      quotingAssetId: null,
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
    const saveMessage = assetPair.id ? 'Asset pair updated' : 'Asset pair added';
    const messageType = assetPair.id ? MessageType.Update : MessageType.Create;
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

        this.assetPairsService.delete(assetPair.id)
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
