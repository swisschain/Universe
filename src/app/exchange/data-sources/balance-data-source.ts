import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { Balance } from '../api/models/balances'
import { AccountDataService } from '../api/services';

export class BalanceDataSource extends BaseDataSource<Balance> {

    constructor(private accountDataService: AccountDataService) {
        super();
    }

    load(walletId: string) {
        this.loadingSubject.next(true);
        this.accountDataService.getBalances(walletId)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: Balance[]) => {
                this.itemsSubject.next(response)
            });
    }
}
