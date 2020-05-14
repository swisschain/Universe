import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { Account } from '../api/models/accounts'
import { AccountService } from '../api/services';
import { PagedResponse } from '../api/models/pagination';

export class AccountDataSource extends BaseDataSource<Account> {

    constructor(private accountService: AccountService) {
        super();
    }

    load(name: string, isDisabled: boolean) {
        this.loadingSubject.next(true);
        this.accountService.get(name, isDisabled)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<Account>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
