import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { BaseDataSource } from './base-data-source';

import { PagedResponse } from '../api/models/pagination/paged-response.interface';
import { Withdrawal, WithdrawalState } from '../api/models/withdrawals';
import { WithdrawalService } from '../api/services';

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
        this.loading();
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
                finalize(() => this.loaded())
            )
            .subscribe((response: PagedResponse<Withdrawal>) => {
                this.itemsSubject.next(response.items);
            },
                (error: HttpErrorResponse) => {
                    this.onError(error);
                });
    }
}
