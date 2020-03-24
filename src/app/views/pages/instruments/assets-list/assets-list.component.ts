import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap, skip, delay, take, catchError, finalize } from 'rxjs/operators';
import { fromEvent, merge, Subscription, of } from 'rxjs';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../core/_base/crud';
import { AssetsDataSource } from '../models/assets-data-source';
import { AssetsService } from '../../../../api/services/assets.service';
import { Asset } from '../../../../api/models/asset.interface';
import { AssetEditDialogComponent } from '../asset-edit/asset-edit.dialog.component';

@Component({
  selector: 'kt-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetsListComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private assetsService: AssetsService) { }

  private subscriptions: Subscription[] = [];

  dataSource: AssetsDataSource;
  displayedColumns = ['name', 'description', 'accuracy', 'isDisabled', 'created', 'modified', 'actions'];

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

    this.dataSource = new AssetsDataSource(this.assetsService);

    this.load();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  load() {
    this.dataSource.load(this.searchInput.nativeElement.value, this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize || 10);
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

  edit(asset) {
		const saveMessage = asset.id ? 'Asset update': 'Asset added';
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

  delete(asset) {
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
              console.log('Asset delete error', error);
              this.layoutUtilsService.showActionNotification('An error occurred while deleting asset.', MessageType.Update, 3000, true, false);
            }
          );
      });
  }
}
