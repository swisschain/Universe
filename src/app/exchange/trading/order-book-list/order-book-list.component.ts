import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

import { OrderBookService } from '../../api/services';
import { OrderBookDataSource } from '../../data-sources';

@Component({
  selector: 'kt-order-book-list',
  templateUrl: './order-book-list.component.html',
  styleUrls: ['./order-book-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderBookListComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private orderBookService: OrderBookService) { }

  private subscriptions: Subscription[] = [];

  dataSource: OrderBookDataSource;
  displayedColumns = ['symbol', 'ask', 'bid', 'mid', 'spread', 'sellOrdersCount', 'buyOrdersCount', 'timestamp', 'actions'];

  ngOnInit() {
    this.dataSource = new OrderBookDataSource(this.orderBookService);
    this.load();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load();
  }
}
