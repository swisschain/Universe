import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { AssetService, AccountDataService } from '../../api/services';
import { CashOperationType } from '../../models/cash-operation-type';

import { BalanceDataSource } from '../../data-sources';

import { CashOperationsDialogComponent } from '../cash-operations/cash-operations.dialog.component';
import { CashTransferDialogComponent } from '../cash-transfer/cash-transfer.dialog.component';

@Component({
  selector: 'kt-balance-list',
  templateUrl: './balance-list.component.html',
  styleUrls: ['./balance-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BalanceListComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private layoutUtilsService: LayoutUtilsService,
    private assetService: AssetService,
    private accountDataService: AccountDataService) { }

  private accountId: number;
  private walletId: number;
  private subscriptions: Subscription[] = [];

  searchByAssetInput = new FormControl();

  dataSource: BalanceDataSource;
  displayedColumns = ['asset', 'available', 'amount', 'reserved', 'actions'];

  assets: string[] = [];
  filteredAssets: Observable<string[]>;

  asset = '';
  status = '';

  ngOnInit() {
    this.dataSource = new BalanceDataSource(this.accountDataService);

    const routeSubscription = this.route.params.subscribe(params => {
      this.accountId = params['accountId'];
      this.walletId = params['walletId'];
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
    this.dataSource.load(this.accountId, this.walletId, this.asset);
  }

  loadAssets() {
    this.assetService.getAll()
      .subscribe(assets => {
        this.assets = assets.map(item => item.symbol);
      });
  }

  cashIn(asset: string) {
    if (this.walletId) {
      this.operationDialog(CashOperationType.CashIn, asset);
    }
  }

  cashOut(asset: string) {
    if (this.walletId)
      this.operationDialog(CashOperationType.CashOut, asset);
  }

  operationDialog(operationType: CashOperationType, asset: string) {
    const message = 'Balance updated';
    const messageType = MessageType.Update;
    const dialogRef = this.dialog.open(CashOperationsDialogComponent, {
      data: {
        asset,
        operationType,
        accountId: this.accountId,
        walletId: this.walletId
      },
      width: '600px'
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.layoutUtilsService.showActionNotification(message, messageType, 1000, true, false);
        this.load();
      });
  }

  transfer(asset: string) {
    const message = 'Transfer executed';
    const messageType = MessageType.Update;
    const dialogRef = this.dialog.open(CashTransferDialogComponent, {
      data: {
        asset,
        accountId: this.accountId,
        walletId: this.walletId
      },
      width: '600px'
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.layoutUtilsService.showActionNotification(message, messageType, 1000, true, false);
        this.load();
      });
  }
}
