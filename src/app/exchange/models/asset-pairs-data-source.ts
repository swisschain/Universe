import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { AssetPair } from '../api/models/asset-pairs/asset-pair.interface'
import { AssetPairsService } from '../api/asset-pairs.service';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class AssetPairsDataSource extends BaseDataSource<AssetPair> {

    constructor(private assetsService: AssetPairsService) {
        super();
    }

    load(symbol: string, baseAsset: string, quotingAsset: string, IsDisabled: boolean) {
        this.loadingSubject.next(true);
        this.assetsService.get(symbol, baseAsset, quotingAsset, IsDisabled)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<AssetPair>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
