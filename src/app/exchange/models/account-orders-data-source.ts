import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { Order } from '../api/models/orders/order.interface'
import { AccountDataService } from '../api/account-data.service';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class AccountOrdersDataSource extends BaseDataSource<Order> {

    constructor(private accountDataService: AccountDataService) {
        super();
    }

    load(walletId: string, assetPair: string, orderType: string, side: string, status: string) {
        this.loadingSubject.next(true);
        this.accountDataService.getOrders(walletId, assetPair, orderType, side, status)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<Order>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
