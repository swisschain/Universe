import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { Order } from '../api/models/orders'
import { AccountDataService } from '../api/services';
import { PagedResponse } from '../api/models/pagination';

export class OrdersDataSource extends BaseDataSource<Order> {

    constructor(private accountDataService: AccountDataService) {
        super();
    }

    load(accountId: number, walletId: number, assetPair: string, orderType: string, side: string, status: string) {
        this.loadingSubject.next(true);
        this.accountDataService.getOrders(accountId, walletId, assetPair, orderType, side, status)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<Order>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
