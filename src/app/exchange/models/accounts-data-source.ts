import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { Account } from '../api/models/accounts/account.interface'
import { AccountsService } from '../api/accounts.service';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class AccountsDataSource extends BaseDataSource<Account> {

    constructor(private accountsService: AccountsService) {
        super();
    }

    load(name: string, isDisabled: boolean) {
        this.loadingSubject.next(true);
        this.accountsService.get(name, isDisabled)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<Account>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
