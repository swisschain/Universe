import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap, skip, delay, take, catchError, finalize, map, startWith } from 'rxjs/operators';
import { fromEvent, merge, Subscription, of, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { Asset } from '../../api/models/assets/asset.interface';
import { AssetsService } from '../../api/assets.service';

import { AssetsDataSource } from '../../models/assets-data-source';
import { AssetEditDialogComponent } from '../asset-edit/asset-edit.dialog.component';
import { AssetDetailsDialogComponent } from '../asset-details/asset-details.dialog.component';

@Component({
  selector: 'kt-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetListComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private assetsService: AssetsService) { }

  searchByIdInput = new FormControl();

  dataSource: AssetsDataSource;
  displayedColumns = ['assetId', 'name', 'description', 'accuracy', 'isDisabled', 'created', 'modified', 'actions'];

  assetIds: string[] = [];
  filteredAssetIds: Observable<string[]>;

  assetId = '';
  status = '';

  ngOnInit() {

    this.dataSource = new AssetsDataSource(this.assetsService);

    const searchByIdSubscription = this.searchByIdInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.assetId = value;
        this.load();
      });

    this.subscriptions.push(searchByIdSubscription);

    this.filteredAssetIds = this.searchByIdInput.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          const filterValue = value.toLowerCase();
          return this.assetIds.filter(assetId => assetId.toLowerCase().includes(filterValue));
        })
      );

    this.load();
    this.loadAssets();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    const status = this.status === 'enabled' ? true : this.status === 'disabled' ? false : null;
    this.dataSource.load(this.assetId, status);
  }

  loadAssets() {
    this.assetsService.getAll()
      .subscribe(assets => {
        this.assetIds = assets.map(item => item.id);
      });
  }

  details(asset: Asset) {
    this.dialog.open(AssetDetailsDialogComponent, { data: { asset }, width: '700px' });
  }

  add() {
    const asset: Asset = {
      id: null,
      name: null,
      description: null,
      accuracy: 0,
      isDisabled: false,
      created: null,
      modified: null
    };

    this.edit(asset);
  }

  edit(asset: Asset) {
    const saveMessage = asset.id ? 'Asset update' : 'Asset added';
    const messageType = asset.id ? MessageType.Update : MessageType.Create;
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

        this.assetsService.delete(asset.id)
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
