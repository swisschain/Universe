import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize, distinctUntilChanged, skip } from 'rxjs/operators';

import { OrderBooksService } from '../api/order-books.service';
import { LimitOrder } from '../api/models/order-books/limit-order.interface';
import { OrderBook } from '../api/models/order-books/order-book.interface';

export class LimitOrdersDataSource implements DataSource<LimitOrder> {

    private itemsSubject = new BehaviorSubject<LimitOrder[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private paginatorTotalSubject = new BehaviorSubject<number>(0);
    private subscriptions: Subscription[] = [];

    constructor(private orderBooksService: OrderBooksService) {
        const hasItemsSubscription = this.paginatorTotal$.pipe(
            distinctUntilChanged(),
            skip(1)
        ).subscribe(res => this.hasItems = res > 0);
        this.subscriptions.push(hasItemsSubscription);
    }

    hasItems = true;
    paginatorTotal$ = this.paginatorTotalSubject.asObservable();
    loading$ = this.loadingSubject.asObservable();

    connect(collectionViewer: CollectionViewer): Observable<LimitOrder[]> {
        return this.itemsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.itemsSubject.complete();
        this.loadingSubject.complete();
        this.paginatorTotalSubject.complete();
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    load(assetPairId: string) {
        this.loadingSubject.next(true);
        this.orderBooksService.getByAssetPairId(assetPairId)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: OrderBook) => {
                this.paginatorTotalSubject.next(response.limitOrders.length);
                this.itemsSubject.next(response.limitOrders.sort((left, right) => (left.price > right.price ? -1 : 1)))
            });
    }
}