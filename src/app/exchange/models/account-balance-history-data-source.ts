import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { BalanceHistory } from '../api/models/balances/balance-history.interface'
import { AccountDataService } from '../api/account-data.service';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';
import { BalanceHistoryType } from '../api/models/balances/balance-history-type';

export class AccountBalanceHistoryDataSource extends BaseDataSource<BalanceHistory> {

    constructor(private accountDataService: AccountDataService) {
        super();
    }

    load(walletId: string, asset: string, balanceHistoryType: BalanceHistoryType) {
        this.loadingSubject.next(true);
        this.accountDataService.getBalanceHistory(walletId, asset, balanceHistoryType)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<BalanceHistory>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
