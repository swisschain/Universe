import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { CashOperationsFee } from '../api/models/fees'
import { Response } from '../api/models/response'
import { CashOperationsFeeService } from '../api/services';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class CashOperationsFeeDataSource extends BaseDataSource<CashOperationsFee> {

    constructor(private cashOperationsFeeService: CashOperationsFeeService) {
        super();
    }

    load(asset: string) {
        this.loadingSubject.next(true);
        this.cashOperationsFeeService.get(asset)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: Response<PagedResponse<CashOperationsFee>>) => {
                this.itemsSubject.next(response.payload.items)
            });
    }
}
