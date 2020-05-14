import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { OrderBookService } from '../api/services';
import { LimitOrder, OrderBook } from '../api/models/order-books';

export class LimitOrderDataSource extends BaseDataSource<LimitOrder> {

    constructor(private orderBookService: OrderBookService) {
        super();
    }

    load(assetPairId: string) {
        this.loadingSubject.next(true);
        this.orderBookService.getByAssetPair(assetPairId)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: OrderBook) => {
                this.itemsSubject.next(response.limitOrders.sort((left, right) => (left.price > right.price ? -1 : 1)))
            });
    }
}
