import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { ApiKey } from '../api/models/vaults'
import { VaultService } from '../api/services';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class VaultApiKeyDataSource extends BaseDataSource<ApiKey> {

    constructor(private vaultService: VaultService) {
        super();
    }

    load(vaultId: number, name: string, isRevoked: boolean) {
        this.loadingSubject.next(true);
        this.vaultService.getApiKeys(vaultId, name, isRevoked)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<ApiKey>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
