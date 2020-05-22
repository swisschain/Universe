import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { BalanceHistory, BalanceHistoryType } from '../api/models/balances'
import { AccountDataService } from '../api/services';
import { PagedResponse } from '../api/models/pagination';

export class BalanceHistoryDataSource extends BaseDataSource<BalanceHistory> {

    constructor(private accountDataService: AccountDataService) {
        super();
    }

    load(accountId: number, walletId: number, asset: string, balanceHistoryType: BalanceHistoryType) {
        this.loadingSubject.next(true);
        this.accountDataService.getBalanceHistory(accountId, walletId, asset, balanceHistoryType)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<BalanceHistory>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
