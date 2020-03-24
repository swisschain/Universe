import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { AssetPairsService } from '../../../../api/services/asset-pairs.service';
import { OrderBooksService } from '../../../../api/services/order-books.service';
import { LimitOrdersDataSource } from '../models/limit-orders-data-source';
import { LimitOrdersService } from '../../../../api/services/limit-orders.service';
import { ActivatedRoute } from '@angular/router';
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
    private assetPairsService: AssetPairsService,
    private orderBooksService: OrderBooksService,
    private limitOrdersService: LimitOrdersService) { }

  private assetPairId: string;
  private assetPairName: string;
  private subscriptions: Subscription[] = [];

  dataSource: LimitOrdersDataSource;
  displayedColumns = ['id', 'price', 'volume', 'walletId', 'actions'];

  ngOnInit() {
    this.dataSource = new LimitOrdersDataSource(this.orderBooksService);

    const routeSub = this.route.params.subscribe(params => {
      this.assetPairId = params['assetPairId'];
      this.loadLimitOrders();
      this.updateAssetPairName();
    });

    this.subscriptions.push(routeSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  loadLimitOrders() {
    this.dataSource.load(this.assetPairId);
  }

  updateAssetPairName() {
    this.assetPairsService.getById(this.assetPairId)
      .subscribe(assetPair => {
        this.assetPairName = assetPair.name;
      });
  }

  refresh() {
    this.loadLimitOrders();
  }

  create() {
    const message = 'Limit order created';
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(LimitOrderEditDialogComponent, { data: { assetPairId: this.assetPairId, assetPairName: this.assetPairName } });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.layoutUtilsService.showActionNotification(message, messageType, 1000, true, false);
        this.loadLimitOrders();
      });
  }

  cancel(limitOrderId: string){
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
              this.loadLimitOrders();
            },
            error => {
              console.log('Cancel limit order error', error);
              this.layoutUtilsService.showActionNotification('An error occurred while cancelling limit order.', MessageType.Update, 3000, true, false);
            }
          );
      });
  }
}
