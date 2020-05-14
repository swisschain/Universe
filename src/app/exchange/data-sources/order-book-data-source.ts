import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { OrderBook, LimitOrderType } from '../api/models/order-books';
import { OrderBookService } from '../api/services';
import { OrderBookRowItem } from '../models/order-book-row-item.interface';
import { PagedResponse } from '../api/models/pagination';

export class OrderBookDataSource extends BaseDataSource<OrderBookRowItem> {

    constructor(private orderBookService: OrderBookService) {
        super();
    }

    load() {
        this.loadingSubject.next(true);
        this.orderBookService.get()
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
