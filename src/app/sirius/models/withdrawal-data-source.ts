import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { PagedResponse } from '../api/models/pagination/paged-response.interface';
import { Withdrawal } from '../api/models/withdrawal/withdrawal.interface';
import { WithdrawalService } from '../api/withdrawal.service';
import { WithdrawalState } from '../api/models/withdrawal/withdrawal-state.enum';

export class WithdrawalDataSource extends BaseDataSource<Withdrawal> {

    constructor(private withdrawalService: WithdrawalService) {
        super();
    }

    load(brokerAccountId: number,
        accountId: number,
        referenceId: string,
        blockchainId: string,
        assetId: number,
        states: WithdrawalState[],
        transactionId: string,
        destinationAddress: string,
        destinationTag: string) {
        this.loadingSubject.next(true);

        this.withdrawalService.get(brokerAccountId,
            accountId,
            referenceId,
            blockchainId,
            assetId,
            states,
            transactionId,
            destinationAddress,
            destinationTag)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<Withdrawal>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
