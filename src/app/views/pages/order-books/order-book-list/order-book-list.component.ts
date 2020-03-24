import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap, skip, delay, take, catchError, finalize } from 'rxjs/operators';
import { fromEvent, merge, Subscription, of } from 'rxjs';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../core/_base/crud';
import { AssetPairsService } from '../../../../api/services/asset-pairs.service';
import { AssetPair } from '../../../../api/models/asset-pair.interface';
import { OrderBooksService } from '../../../../api/services/order-books.service';
import { OrderBooksDataSource } from '../models/order-books-data-source';

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
    private layoutUtilsService: LayoutUtilsService,
    private assetPairsService: AssetPairsService,
    private orderBooksService: OrderBooksService) { }

  private assetPairs: AssetPair[];
  private subscriptions: Subscription[] = [];

  dataSource: OrderBooksDataSource;
  displayedColumns = ['assetPairName', 'ask', 'bid', 'mid', 'spread', 'sellOrdersCount', 'buyOrdersCount', 'timestamp', 'actions'];

  ngOnInit() {
    this.dataSource = new OrderBooksDataSource(this.orderBooksService);

    this.assetPairsService.getAll()
      .subscribe(response => {
        this.assetPairs = response.items;
        this.load();
      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  load() {
    this.dataSource.load();
  }

  getAssetPairName(assetPairId) {
    var assetPair = this.assetPairs.filter((assetPair)=> assetPair.id == assetPairId)[0];

    return assetPair ? assetPair.name : 'unknown';
  }

  refresh(){
    this.dataSource.load();
  }
}
