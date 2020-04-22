import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { AccountRequisite } from '../api/models/account/account-requisite.interface'
import { AccountService } from '../api/account.service';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class AccountRequisitesDataSource extends BaseDataSource<AccountRequisite> {

    constructor(private accountService: AccountService) {
        super();
    }

    load(brokerAccountId: number, blockchainId: string) {
        this.loadingSubject.next(true);
        this.accountService.getRequisites(brokerAccountId, blockchainId)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<AccountRequisite>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
