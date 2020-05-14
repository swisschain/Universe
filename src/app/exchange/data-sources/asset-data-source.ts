import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { Asset } from '../api/models/assets'
import { AssetService } from '../api/services';
import { PagedResponse } from '../api/models/pagination';

export class AssetDataSource extends BaseDataSource<Asset> {

    constructor(private assetService: AssetService) {
        super();
    }

    load(symbol: string, IsDisabled: boolean) {
        this.loadingSubject.next(true);
        this.assetService.get(symbol, IsDisabled)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<Asset>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
