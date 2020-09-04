import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { BaseDataSource } from './base-data-source';

import { Account } from '../api/models/accounts'
import { AccountService } from '../api/services';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class AccountsDataSource extends BaseDataSource<Account> {

    constructor(private accountService: AccountService) {
        super();
    }

    load(brokerAccountId: number, referenceId: string) {
        this.loading();
        this.accountService.get(brokerAccountId, referenceId)
            .pipe(
                finalize(() => this.loaded())
            )
            .subscribe((response: PagedResponse<Account>) => {
                this.itemsSubject.next(response.items);
            },
                (error: HttpErrorResponse) => {
                    this.onError(error);
                });
    }
}
