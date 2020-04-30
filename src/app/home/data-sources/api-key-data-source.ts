import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { ApiKey, Product } from '../api/models/api-keys'
import { ApiKeyService } from '../api/services';

export class ApiKeyDataSource extends BaseDataSource<ApiKey> {

    constructor(private apiKeyService: ApiKeyService) {
        super();
    }

    load(searchValue: string, isDeleted: boolean, product: Product) {
        this.loadingSubject.next(true);

        this.apiKeyService.get(searchValue, isDeleted, product)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: ApiKey[]) => {
                this.itemsSubject.next(response)
            });
    }
}
