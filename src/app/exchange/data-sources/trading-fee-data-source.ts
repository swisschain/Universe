import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { TradingFee } from '../api/models/fees'
import { Response } from '../api/models/response'
import { TradingFeeService } from '../api/services';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class TradingFeeDataSource extends BaseDataSource<TradingFee> {

    constructor(private tradingFeeService: TradingFeeService) {
        super();
    }

    load(assetPair: string) {
        this.loadingSubject.next(true);
        this.tradingFeeService.get(assetPair)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: Response<PagedResponse<TradingFee>>) => {
                this.itemsSubject.next(response.payload.items)
            });
    }
}
