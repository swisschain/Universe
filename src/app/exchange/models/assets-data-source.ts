import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { Asset } from '../api/models/assets/asset.interface'
import { AssetsService } from '../api/assets.service';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class AssetsDataSource extends BaseDataSource<Asset> {

    constructor(private assetsService: AssetsService) {
        super();
    }

    load(symbol: string, IsDisabled: boolean) {
        this.loadingSubject.next(true);
        this.assetsService.get(symbol, IsDisabled)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<Asset>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
