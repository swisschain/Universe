import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap, skip, delay, take, catchError, finalize } from 'rxjs/operators';
import { fromEvent, merge, Subscription, of } from 'rxjs';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../core/_base/crud';
import { AssetPairsDataSource } from '../models/asset-pairs-data-source';
import { AssetsService } from '../../../../api/services/assets.service';
import { AssetPairsService } from '../../../../api/services/asset-pairs.service';
import { Asset } from '../../../../api/models/asset.interface';
import { AssetPair } from '../../../../api/models/asset-pair.interface';
import { AssetPairEditDialogComponent } from '../asset-pair-edit/asset-pair-edit.dialog.component';

@Component({
  selector: 'kt-asset-pairs-list',
  templateUrl: './asset-pairs-list.component.html',
  styleUrls: ['./asset-pairs-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetPairsListComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private assetsService: AssetsService,
    private assetPairsService: AssetPairsService) { }

  private assets: Asset[];
  private subscriptions: Subscription[] = [];

  dataSource: AssetPairsDataSource;
  displayedColumns = ['name', 'baseAssetName', 'quotingAssetName', 'accuracy', 'minVolume', 'maxVolume', 'maxOppositeVolume', 'marketOrderPriceThreshold', 'isDisabled', 'created', 'modified', 'actions'];

  ngOnInit() {
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.subscriptions.push(sortSubscription);

    const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.load())
    ).subscribe();
    this.subscriptions.push(paginatorSubscriptions);

    const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.load();
      })
    ).subscribe();
    this.subscriptions.push(searchSubscription);

    this.dataSource = new AssetPairsDataSource(this.assetPairsService);

    this.assetsService.getAll()
      .subscribe(response => {
        this.assets = response.items;
        this.load();
      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  load() {
    this.dataSource.load(this.searchInput.nativeElement.value, this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
  }

  getAssetName(assetId) {
    var asset = this.assets.filter((asset)=> asset.id == assetId)[0];

    return asset ? asset.name : 'unknown';
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

  edit(assetPair) {
    const saveMessage = assetPair.id ? 'Asset pair updated' : 'Asset pair added';
    const messageType = assetPair.id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(AssetPairEditDialogComponent, { data: { assetPair } });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 1000, true, false);
        this.load();
      });
  }

  delete(assetPair) {
    const dialogRef = this.layoutUtilsService.deleteElement('Asset Pair Delete', 'Are you sure to permanently delete this asset pair?', 'Asset pair is deleting...');
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
              console.log('Asset pair delete error', error);
              this.layoutUtilsService.showActionNotification('An error occurred while deleting asset pair.', MessageType.Update, 3000, true, false);
            }
          );
      });
  }
}
