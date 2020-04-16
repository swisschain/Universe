import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

import { OrderBooksService } from '../../api/order-books.service';
import { OrderBooksDataSource } from '../../models/order-books-data-source';

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
    private orderBooksService: OrderBooksService) { }

  private subscriptions: Subscription[] = [];

  dataSource: OrderBooksDataSource;
  displayedColumns = ['symbol', 'ask', 'bid', 'mid', 'spread', 'sellOrdersCount', 'buyOrdersCount', 'timestamp', 'actions'];

  ngOnInit() {
    this.dataSource = new OrderBooksDataSource(this.orderBooksService);
    this.load();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load();
  }
}
