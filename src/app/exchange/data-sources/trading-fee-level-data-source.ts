import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { TradingFeeLevel } from '../api/models/fees'
import { Response } from '../api/models/response'
import { TradingFeeService } from '../api/services';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class TradingFeeLevelDataSource extends BaseDataSource<TradingFeeLevel> {

    constructor(private tradingFeeService: TradingFeeService) {
        super();
    }

    load(tradingFeeId: number) {
        this.loadingSubject.next(true);
        this.tradingFeeService.getLevels(tradingFeeId)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: Response<TradingFeeLevel[]>) => {
                this.itemsSubject.next(response.payload)
            });
    }
}
