import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { Account } from '../api/models/account/account.interface'
import { AccountService } from '../api/account.service';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class AccountsDataSource extends BaseDataSource<Account> {

    constructor(private accountService: AccountService) {
        super();
    }

    load(brokerAccountId: number, referenceId: string) {
        this.loadingSubject.next(true);

        this.accountService.get(brokerAccountId, referenceId)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<Account>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
