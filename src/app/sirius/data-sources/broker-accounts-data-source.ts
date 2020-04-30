import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { BrokerAccount } from '../api/models/brocker-accounts'
import { BrokerAccountService } from '../api/services';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class BrokerAccountsDataSource extends BaseDataSource<BrokerAccount> {

    constructor(private brokerAccountService: BrokerAccountService) {
        super();
    }

    load() {
        this.loadingSubject.next(true);

        this.brokerAccountService.get()
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<BrokerAccount>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
