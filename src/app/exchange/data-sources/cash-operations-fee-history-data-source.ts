import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { CashOperationsFeeHistory } from '../api/models/fees'
import { Response } from '../api/models/response'
import { FeeHistoryService } from '../api/services';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class CashOperationsFeeHistoryDataSource extends BaseDataSource<CashOperationsFeeHistory> {

    constructor(private feeHistoryService: FeeHistoryService) {
        super();
    }

    load(asset: string) {
        this.loadingSubject.next(true);
        this.feeHistoryService.getCashOperations(asset)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: Response<PagedResponse<CashOperationsFeeHistory>>) => {
                this.itemsSubject.next(response.payload.items)
            });
    }
}
