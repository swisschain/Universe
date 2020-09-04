import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { BaseDataSource } from './base-data-source';

import { KeyKeeper } from '../api/models/key-keepers'
import { KeyKeeperService } from '../api/services';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class KeyKeeperDataSource extends BaseDataSource<KeyKeeper> {

    constructor(private keyKeeperService: KeyKeeperService) {
        super();
    }

    load(externalId: string, description: string) {
        this.loading();
        this.keyKeeperService.get(externalId, description)
            .pipe(
                finalize(() => this.loaded())
            )
            .subscribe((response: PagedResponse<KeyKeeper>) => {
                this.itemsSubject.next(response.items);
            },
                (error: HttpErrorResponse) => {
                    this.onError(error);
                });
    }
}
