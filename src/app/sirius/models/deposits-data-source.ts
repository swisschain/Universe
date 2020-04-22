import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { Deposit } from '../api/models/deposits/deposit.interface';
import { DepositState } from '../api/models/deposits/deposit-state.enum';
import { DepositsService } from '../api/deposits.service';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class DepositsDataSource extends BaseDataSource<Deposit> {

    constructor(private depositsService: DepositsService) {
        super();
    }

    load(brokerAccountId: number, accountId: number, referenceId: string, blockchainId: string, assetId: number, states: DepositState[]) {
        this.loadingSubject.next(true);

        this.depositsService.get(brokerAccountId, accountId, referenceId, blockchainId, assetId, states)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<Deposit>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
