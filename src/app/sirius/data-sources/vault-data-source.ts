import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { Vault, VaultType } from '../api/models/vaults'
import { VaultService } from '../api/services';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class VaultDataSource extends BaseDataSource<Vault> {

    constructor(private vaultService: VaultService) {
        super();
    }

    load(name: string, type: VaultType) {
        this.loadingSubject.next(true);

        this.vaultService.get(name, type)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<Vault>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
