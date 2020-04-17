import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { AccountOrdersDataSource } from '../../models/accounts-orders-data-source';
import { AccountDataService } from '../../api/account-data.service';
import { AssetPairsService } from '../../api/asset-pairs.service';
import { LimitOrdersService } from '../../api/limit-orders.service';
import { Order } from '../../api/models/orders/order.interface';
import { LimitOrderEditDialogComponent } from '../../trading/limit-order-edit/limit-order-edit.dialog.component';
import { MarketOrderEditDialogComponent } from '../../trading/market-order-edit/market-order-edit.dialog.component';
import { OrderDetailsDialogComponent } from '../order-details/order-details.dialog.component';

@Component({
  selector: 'kt-account-order-list',
  templateUrl: './account-order-list.component.html',
  styleUrls: ['./account-order-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountOrderListComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private layoutUtilsService: LayoutUtilsService,
    private assetPairsService: AssetPairsService,
    private accountDataService: AccountDataService,
    private limitOrdersService: LimitOrdersService) { }

  private accountId: string;
  private subscriptions: Subscription[] = [];

  searchByAssetPairInput = new FormControl();

  dataSource: AccountOrdersDataSource;
  displayedColumns = ['createdAt', 'assetPair', 'type', 'side', 'price', 'volume', 'remainingVolume', 'status', 'actions'];

  assetPairs: string[] = [];
  filteredAssetPairs: Observable<string[]>;

  assetPair = '';
  type = '';
  side = '';
  status = '';

  ngOnInit() {
    this.dataSource = new AccountOrdersDataSource(this.accountDataService);

    const routeSubscription = this.route.params.subscribe(params => {
      this.accountId = params['accountId'];
      this.load();
    });

    this.subscriptions.push(routeSubscription);

    const searchByAssetPairSubscription = this.searchByAssetPairInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.assetPair = value;
        this.load();
      });

    this.subscriptions.push(searchByAssetPairSubscription);

    this.filteredAssetPairs = this.searchByAssetPairInput.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          const filterValue = value.toLowerCase();
          return this.assetPairs.filter(assetPair => assetPair.toLowerCase().includes(filterValue));
        })
      );

    this.loadAssetPairs();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load(this.accountId, this.assetPair, this.type, this.side, this.status);
  }

  loadAssetPairs() {
    this.assetPairsService.getAll()
      .subscribe(assetPairs => {
        this.assetPairs = assetPairs.map(item => item.symbol);
      });
  }

  canCancel(order: Order) {
    return order.status === 'placed' || order.status === 'partiallyMatched' || order.status === 'pending';
  }

  cancel(order: Order) {
    const dialogRef = this.layoutUtilsService.deleteElement('Cancel limit order', 'Are you sure you want to cancel limit order?', 'Limit order is cancelling...');
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.limitOrdersService.cancel(order.id)
          .subscribe(
            response => {
              this.layoutUtilsService.showActionNotification('Limit order has been cancelled.', MessageType.Delete, 3000, true, false);
              this.load();
            },
            error => {
              this.layoutUtilsService.showActionNotification('An error occurred while cancelling limit order.', MessageType.Update, 3000, true, false);
            }
          );
      });
  }

  createLimitOrder() {
    const message = 'Limit order created';
    const messageType = MessageType.Update;
    const dialogRef = this.dialog.open(LimitOrderEditDialogComponent, { data: { walletId: this.accountId }, width: '500px' });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.layoutUtilsService.showActionNotification(message, messageType, 1000, true, false);
        this.load();
      });
  }

  createMarketOrder() {
    const message = 'Market order created';
    const messageType = MessageType.Update;
    const dialogRef = this.dialog.open(MarketOrderEditDialogComponent, { data: { walletId: this.accountId }, width: '500px' });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.layoutUtilsService.showActionNotification(message, messageType, 1000, true, false);
        this.load();
      });
  }

  details(order: Order) {
    this.dialog.open(OrderDetailsDialogComponent, { data: { order }, width: '700px' });
  }

  trades(order: Order) {

  }
}
