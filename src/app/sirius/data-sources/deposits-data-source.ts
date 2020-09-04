import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { BaseDataSource } from './base-data-source';

import { Deposit } from '../api/models/deposits';
import { DepositState } from '../api/models/deposits';
import { DepositsService } from '../api/services';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class DepositsDataSource extends BaseDataSource<Deposit> {

    constructor(private depositsService: DepositsService) {
        super();
    }

    load(brokerAccountId: number, accountId: number, referenceId: string, blockchainId: string, assetId: number, states: DepositState[]) {
        this.loading();
        this.depositsService.get(brokerAccountId, accountId, referenceId, blockchainId, assetId, states)
            .pipe(
                finalize(() => this.loaded())
            )
            .subscribe((response: PagedResponse<Deposit>) => {
                this.itemsSubject.next(response.items);
            },
                (error: HttpErrorResponse) => {
                    this.onError(error);
                });
    }
}
