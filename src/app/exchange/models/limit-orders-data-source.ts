import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { OrderBooksService } from '../api/order-books.service';
import { LimitOrder } from '../api/models/order-books/limit-order.interface';
import { OrderBook } from '../api/models/order-books/order-book.interface';

export class LimitOrdersDataSource extends BaseDataSource<LimitOrder> {

    constructor(private orderBooksService: OrderBooksService) {
        super();
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
