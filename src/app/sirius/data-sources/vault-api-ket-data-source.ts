import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { BaseDataSource } from './base-data-source';

import { ApiKey } from '../api/models/vaults'
import { VaultService } from '../api/services';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class VaultApiKeyDataSource extends BaseDataSource<ApiKey> {

    constructor(private vaultService: VaultService) {
        super();
    }

    load(vaultId: number, name: string, isRevoked: boolean) {
        this.loading();
        this.vaultService.getApiKeys(vaultId, name, isRevoked)
            .pipe(
                finalize(() => this.loaded())
            )
            .subscribe((response: PagedResponse<ApiKey>) => {
                this.itemsSubject.next(response.items);
            },
                (error: HttpErrorResponse) => {
                    this.onError(error);
                });
    }
}
