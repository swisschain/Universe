import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { Balance } from '../api/models/balances'
import { AccountDataService } from '../api/services';
import { PagedResponse } from '../api/models/pagination';

export class BalanceDataSource extends BaseDataSource<Balance> {

    constructor(private accountDataService: AccountDataService) {
        super();
    }

    load(accountId: number, walletId: number, asset: string) {
        this.loadingSubject.next(true);
        this.accountDataService.getBalances(accountId, walletId, asset)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<Balance>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
