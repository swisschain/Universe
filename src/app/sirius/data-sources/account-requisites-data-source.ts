import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { BaseDataSource } from './base-data-source';

import { AccountRequisite } from '../api/models/accounts'
import { AccountService } from '../api/services';

import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class AccountRequisitesDataSource extends BaseDataSource<AccountRequisite> {

    constructor(private accountService: AccountService) {
        super();
    }

    load(brokerAccountId: number, blockchainId: string) {
        this.loading();
        this.accountService.getRequisites(brokerAccountId, blockchainId)
            .pipe(
                finalize(() => this.loaded())
            )
            .subscribe((response: PagedResponse<AccountRequisite>) => {
                this.itemsSubject.next(response.items);
            },
                (error: HttpErrorResponse) => {
                    this.onError(error);
                });
    }
}
