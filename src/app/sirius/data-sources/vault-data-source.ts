import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { BaseDataSource } from './base-data-source';

import { Vault, VaultType } from '../api/models/vaults'
import { VaultService } from '../api/services';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class VaultDataSource extends BaseDataSource<Vault> {

    constructor(private vaultService: VaultService) {
        super();
    }

    load(name: string, type: VaultType) {
        this.loading();
        this.vaultService.get(name, type)
            .pipe(
                finalize(() => this.loaded())
            )
            .subscribe((response: PagedResponse<Vault>) => {
                this.itemsSubject.next(response.items);
            },
                (error: HttpErrorResponse) => {
                    this.onError(error);
                });
    }
}
