import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { CashOperationsFee } from '../api/models/fees'
import { Response } from '../api/models/response'
import { FeeService } from '../api/services';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class CashOperationsFeeDataSource extends BaseDataSource<CashOperationsFee> {

    constructor(private feeService: FeeService) {
        super();
    }

    load(asset: string) {
        this.loadingSubject.next(true);
        this.feeService.get(asset)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: Response<PagedResponse<CashOperationsFee>>) => {
                this.itemsSubject.next(response.payload.items)
            });
    }
}
