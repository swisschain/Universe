import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { BaseDataSource } from './base-data-source';

import { BrokerBalance } from '../api/models/brocker-accounts';
import { BrokerAccountService } from '../api/services';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class BrokerAccountBalancesDataSource extends BaseDataSource<BrokerBalance> {

    constructor(private brokerAccountService: BrokerAccountService) {
        super();
    }

    load(brokerAccountId: number) {
        this.loading();
        this.brokerAccountService.getBalances(brokerAccountId)
            .pipe(
                finalize(() => this.loaded())
            )
            .subscribe((response: PagedResponse<BrokerBalance>) => {
                this.itemsSubject.next(response.items);
            },
                (error: HttpErrorResponse) => {
                    this.onError(error);
                });
    }
}
