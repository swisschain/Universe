import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { Trade } from '../api/models/trades'
import { AccountDataService } from '../api/services';
import { PagedResponse } from '../api/models/pagination';

export class TradeDataSource extends BaseDataSource<Trade> {

    constructor(private accountDataService: AccountDataService) {
        super();
    }

    load(accountId: number, walletId: number, baseAsset: string, quotingAsset: string) {
        this.loadingSubject.next(true);
        this.accountDataService.getTrades(accountId, walletId, baseAsset, quotingAsset)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<Trade>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
