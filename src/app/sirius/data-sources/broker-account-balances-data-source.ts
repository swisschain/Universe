import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { BrokerBalance } from '../api/models/brocker-accounts'
import { BrokerAccountService } from '../api/services';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class BrokerAccountBalancesDataSource extends BaseDataSource<BrokerBalance> {

    constructor(private brokerAccountService: BrokerAccountService) {
        super();
    }

    load(brokerAccountId: number) {
        this.loadingSubject.next(true);

        this.brokerAccountService.getBalances(brokerAccountId)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<BrokerBalance>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
