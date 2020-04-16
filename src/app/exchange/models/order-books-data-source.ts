import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize, distinctUntilChanged, skip } from 'rxjs/operators';

import { OrderBook } from '../api/models/order-books/order-book.interface';
import { LimitOrderType } from '../api/models/order-books/limit-order-type.enum';
import { OrderBooksService } from '../api/order-books.service';
import { OrderBookRowItem } from './order-book-row-item.interface';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class OrderBooksDataSource implements DataSource<OrderBookRowItem> {

    constructor(private orderBooksService: OrderBooksService) {
        const hasItemsSubscription = this.itemsSubject.asObservable().pipe(
            distinctUntilChanged(),
            skip(1)
        ).subscribe(result => this.hasItems = result && result.length > 0);
        this.subscriptions.push(hasItemsSubscription);
    }

    private itemsSubject = new BehaviorSubject<OrderBookRowItem[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private subscriptions: Subscription[] = [];

    hasItems = true;
    loading$ = this.loadingSubject.asObservable();
    isPreloadTextViewed$ = this.loadingSubject.asObservable();

    connect(collectionViewer: CollectionViewer): Observable<OrderBookRowItem[]> {
        return this.itemsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.itemsSubject.complete();
        this.loadingSubject.complete();
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    load() {
        this.loadingSubject.next(true);
        this.orderBooksService.get()
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((orderBooks: PagedResponse<OrderBook>) => {
                this.itemsSubject.next(orderBooks.items.map(orderBook => {
                    const ask = this.getPrice(orderBook, LimitOrderType.Sell);
                    const bid = this.getPrice(orderBook, LimitOrderType.Buy);
                    return {
                        symbol: orderBook.symbol,
                        ask: ask,
                        bid: bid,
                        mid: ask && bid ? (ask + bid) / 2 : null,
                        spread: ask && bid ? ask - bid : null,
                        sellOrdersCount: orderBook.limitOrders
                            .filter(limitOrder => limitOrder.type === LimitOrderType.Sell)
                            .length,
                        buyOrdersCount: orderBook.limitOrders
                            .filter(limitOrder => limitOrder.type === LimitOrderType.Buy)
                            .length,
                        timestamp: orderBook.timestamp
                    }
                }))
            });
    }

    private getPrice(orderBook: OrderBook, limitOrderType: LimitOrderType) {
        const sign = limitOrderType === LimitOrderType.Sell ? 1 : -1;
        const bestLimitOrder = orderBook.limitOrders
            .filter(limitOrder => limitOrder.type === limitOrderType)
            .sort((left, right) => (left.price > right.price ? 1 * sign : -1 * sign))[0];
        return bestLimitOrder ? bestLimitOrder.price : null;
    }
}
