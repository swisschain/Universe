import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { BrokerAccountRequisite } from '../api/models/brocker-accounts'
import { BrokerAccountService } from '../api/services';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class BrokerAccountRequisitesDataSource extends BaseDataSource<BrokerAccountRequisite> {

    constructor(private brokerAccountService: BrokerAccountService) {
        super();
    }

    load(brokerAccountId: number, blockchainId: string) {
        this.loadingSubject.next(true);
        this.brokerAccountService.getRequisites(brokerAccountId, blockchainId)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<BrokerAccountRequisite>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
