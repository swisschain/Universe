import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { BaseDataSource } from './base-data-source';

import { BrokerAccount } from '../api/models/brocker-accounts';
import { BrokerAccountService } from '../api/services';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class BrokerAccountsDataSource extends BaseDataSource<BrokerAccount> {

    constructor(private brokerAccountService: BrokerAccountService) {
        super();
    }

    load() {
        this.loading();
        this.brokerAccountService.get()
            .pipe(
                finalize(() => this.loaded())
            )
            .subscribe((response: PagedResponse<BrokerAccount>) => {
                this.itemsSubject.next(response.items);
            },
                (error: HttpErrorResponse) => {
                    this.onError(error);
                });
    }
}
