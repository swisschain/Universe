import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { BalancesDataSource } from '../../models/balances-data-source';
import { AccountDataService } from '../../api/account-data.service';
import { AssetsService } from '../../api/assets.service';
import { CashOperationType } from '../../models/cash-operation-type';
import { CashOperationsDialogComponent } from '../cash-operations/cash-operations.dialog.component';
import { CashTransferDialogComponent } from '../cash-transfer/cash-transfer.dialog.component';

@Component({
  selector: 'kt-account-balance-list',
  templateUrl: './account-balance-list.component.html',
  styleUrls: ['./account-balance-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountBalanceListComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private layoutUtilsService: LayoutUtilsService,
    private assetsService: AssetsService,
    private accountDataService: AccountDataService) { }

  private accountId: string;
  private subscriptions: Subscription[] = [];

  searchByAssetInput = new FormControl();

  dataSource: BalancesDataSource;
  displayedColumns = ['symbol', 'available', 'amount', 'reserved', 'actions'];

  assets: string[] = [];
  filteredAssets: Observable<string[]>;

  asset = '';
  status = '';

  ngOnInit() {
    this.dataSource = new BalancesDataSource(this.accountDataService);

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
    this.dataSource.load(this.accountId);
  }

  loadAssets() {
    this.assetsService.getAll()
      .subscribe(assets => {
        this.assets = assets.map(item => item.symbol);
      });
  }

  cashIn(asset: string) {
    if (this.accountId) {
      this.operationDialog(CashOperationType.CashIn, asset);
    }
  }

  cashOut(asset: string) {
    if (this.accountId)
      this.operationDialog(CashOperationType.CashOut, asset);
  }

  operationDialog(operationType: CashOperationType, asset: string) {
    const message = 'Balance updated';
    const messageType = MessageType.Update;
    const dialogRef = this.dialog.open(CashOperationsDialogComponent, {
      data: {
        asset,
        operationType,
        walletId: this.accountId
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
        walletId: this.accountId
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
