import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize, distinctUntilChanged, skip } from 'rxjs/operators';

import { OrderBooksService } from '../api/order-books.service';
import { LimitOrder } from '../api/models/order-books/limit-order.interface';
import { OrderBook } from '../api/models/order-books/order-book.interface';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class LimitOrdersDataSource implements DataSource<LimitOrder> {

    constructor(private orderBooksService: OrderBooksService) {
        const hasItemsSubscription = this.itemsSubject.asObservable().pipe(
            distinctUntilChanged(),
            skip(1)
        ).subscribe(result => this.hasItems = result && result.length > 0);
        this.subscriptions.push(hasItemsSubscription);
    }

    private itemsSubject = new BehaviorSubject<LimitOrder[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private subscriptions: Subscription[] = [];

    hasItems = true;
    loading$ = this.loadingSubject.asObservable();
    isPreloadTextViewed$ = this.loadingSubject.asObservable();

    connect(collectionViewer: CollectionViewer): Observable<LimitOrder[]> {
        return this.itemsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.itemsSubject.complete();
        this.loadingSubject.complete();
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    load(assetPairId: string) {
        this.loadingSubject.next(true);
        this.orderBooksService.getByAssetPair(assetPairId)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: OrderBook) => {
                this.itemsSubject.next(response.limitOrders.sort((left, right) => (left.price > right.price ? -1 : 1)))
            });
    }
}