import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { OrderBooksService } from '../../api/order-books.service';
import { LimitOrdersService } from '../../api/limit-orders.service';
import { LimitOrdersDataSource } from '../../models/limit-orders-data-source';
import { LimitOrderEditDialogComponent } from '../limit-order-edit/limit-order-edit.dialog.component';

@Component({
  selector: 'kt-order-book-details',
  templateUrl: './order-book-details.component.html',
  styleUrls: ['./order-book-details.component.scss']
})
export class OrderBookDetailsComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private layoutUtilsService: LayoutUtilsService,
    private limitOrdersService: LimitOrdersService,
    private orderBooksService: OrderBooksService) { }

  private subscriptions: Subscription[] = [];

  symbol: string;
  dataSource: LimitOrdersDataSource;
  displayedColumns = ['buyPrice', 'volume', 'sellPrice', 'walletId', 'limitOrderId', 'actions'];

  ngOnInit() {
    this.dataSource = new LimitOrdersDataSource(this.orderBooksService);

    const routeSubscription = this.route.params.subscribe(params => {
      this.symbol = params['symbol'];
      this.load();
    });

    this.subscriptions.push(routeSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load(this.symbol);
  }

  create() {
    const message = 'Limit order created';
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(LimitOrderEditDialogComponent, { data: { assetPairId: this.symbol } });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.layoutUtilsService.showActionNotification(message, messageType, 1000, true, false);
        this.load();
      });
  }

  cancel(limitOrderId: string) {
    const dialogRef = this.layoutUtilsService.deleteElement('Cancel limit order', 'Are you sure you want to cancel limit order?', 'Limit order is cancelling...');
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.limitOrdersService.cancel(limitOrderId)
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

  do(item: any)
  {
    console.log(item);
  }
}
