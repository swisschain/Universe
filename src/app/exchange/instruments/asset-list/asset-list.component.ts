import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap, skip, delay, take, catchError, finalize, map, startWith } from 'rxjs/operators';
import { fromEvent, merge, Subscription, of, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { Asset } from '../../api/models/assets';
import { AssetService } from '../../api/services';

import { AssetDataSource } from '../../data-sources';
import { AssetEditDialogComponent } from '../asset-edit/asset-edit.dialog.component';
import { AssetDetailsDialogComponent } from '../asset-details/asset-details.dialog.component';

@Component({
  selector: 'kt-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetListComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private assetService: AssetService) { }

  private subscriptions: Subscription[] = [];

  searchBySymbolInput = new FormControl();

  dataSource: AssetDataSource;
  displayedColumns = ['symbol', 'description', 'accuracy', 'isDisabled', 'created', 'modified', 'actions'];

  assetSymbols: string[] = [];
  filteredAssetSymbols: Observable<string[]>;

  assetSymbol = '';
  status = '';

  ngOnInit() {

    this.dataSource = new AssetDataSource(this.assetService);

    const searchByIdSubscription = this.searchBySymbolInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.assetSymbol = value;
        this.load();
      });

    this.subscriptions.push(searchByIdSubscription);

    this.filteredAssetSymbols = this.searchBySymbolInput.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          const filterValue = value.toLowerCase();
          return this.assetSymbols.filter(assetSymbol => assetSymbol.toLowerCase().includes(filterValue));
        })
      );

    this.load();
    this.loadAssets();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    const isDisabled = this.status === 'enabled' ? false : this.status === 'disabled' ? true : null;
    this.dataSource.load(this.assetSymbol, isDisabled);
  }

  loadAssets() {
    this.assetService.getAll()
      .subscribe(assets => {
        this.assetSymbols = assets.map(item => item.symbol);
      });
  }

  details(asset: Asset) {
    this.dialog.open(AssetDetailsDialogComponent, { data: { asset }, width: '700px' });
  }

  add() {
    const asset: Asset = {
      symbol: null,
      description: null,
      accuracy: 0,
      isDisabled: false,
      created: null,
      modified: null
    };

    this.edit(asset);
  }

  edit(asset: Asset) {
    const saveMessage = asset.symbol ? 'Asset update' : 'Asset added';
    const messageType = asset.symbol ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(AssetEditDialogComponent, { data: { asset } });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(saveMessage, messageType, 1000, true, false);
      this.load();
    });
  }

  delete(asset: Asset) {
    const dialogRef = this.layoutUtilsService.deleteElement('Asset Delete', 'Are you sure to permanently delete this asset?', 'Asset is deleting...');
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.assetService.delete(asset.symbol)
          .subscribe(
            response => {
              this.layoutUtilsService.showActionNotification('Asset has been deleted.', MessageType.Delete, 3000, true, false);
              this.load();
            },
            error => {
              this.layoutUtilsService.showActionNotification('An error occurred while deleting asset.', MessageType.Update, 3000, true, false);
            }
          );
      });
  }
}
