import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { AssetPair } from '../api/models/asset-pairs'
import { AssetPairService } from '../api/services';
import { PagedResponse } from '../api/models/pagination';

export class AssetPairDataSource extends BaseDataSource<AssetPair> {

    constructor(private assetService: AssetPairService) {
        super();
    }

    load(symbol: string, baseAsset: string, quotingAsset: string, IsDisabled: boolean) {
        this.loadingSubject.next(true);
        this.assetService.get(symbol, baseAsset, quotingAsset, IsDisabled)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<AssetPair>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
