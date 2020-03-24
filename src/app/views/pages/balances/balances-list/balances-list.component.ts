import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap, skip, delay, take, catchError, finalize } from 'rxjs/operators';
import { fromEvent, merge, Subscription, of } from 'rxjs';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../core/_base/crud';
import { BalancesDataSource } from '../models/balances-data-source';
import { AssetsService } from '../../../../api/services/assets.service';
import { BalancesService } from '../../../../api/services/balances.service';
import { Asset } from '../../../../api/models/asset.interface';
import { Balance } from '../../../../api/models/balance.interface';
import { CashOperationsDialogComponent } from '../cash-operations/cash-operations.dialog.component';
import { CashOperationType } from '../models/cash-operation-type';

@Component({
  selector: 'kt-balances-list',
  templateUrl: './balances-list.component.html',
  styleUrls: ['./balances-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BalancesListComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private assetsService: AssetsService,
    private balancesService: BalancesService) { }

  private assets: Asset[];
  private subscriptions: Subscription[] = [];

  walletId: string;
  dataSource: BalancesDataSource;
  displayedColumns = ['asset', 'amount', 'reserved', 'timestamp', 'actions'];

  ngOnInit() {
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.subscriptions.push(sortSubscription);

    const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.load())
    ).subscribe();
    this.subscriptions.push(paginatorSubscriptions);

    const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      debounceTime(250),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.walletId = this.searchInput.nativeElement.value;
        this.load();
      })
    ).subscribe();
    this.subscriptions.push(searchSubscription);

    this.dataSource = new BalancesDataSource(this.balancesService);

    this.assetsService.getAll()
      .subscribe(response => {
        this.assets = response.items;
      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  load() {
    this.dataSource.load(this.searchInput.nativeElement.value, this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
  }

  getAssetName(assetId) {
    var asset = this.assets.filter((asset) => asset.id == assetId)[0];

    return asset ? asset.name : 'unknown';
  }

  cashIn(assetId: string) {
    if (this.walletId)
      this.operationDialog(CashOperationType.CashIn, assetId);
  }

  cashOut(assetId: string) {
    if (this.walletId)
      this.operationDialog(CashOperationType.CashOut, assetId);
  }

  operationDialog(operationType: CashOperationType, assetId: string) {
    const message = 'Balance updated';
    const messageType = MessageType.Update;
    const dialogRef = this.dialog.open(CashOperationsDialogComponent, {
      data: {
        assetId,
        operationType,
        walletId: this.searchInput.nativeElement.value
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(message, messageType, 1000, true, false);
      this.load();
    });
  }
}
