import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { KeyKeeper } from '../api/models/key-keepers'
import { KeyKeeperService } from '../api/services';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class KeyKeeperDataSource extends BaseDataSource<KeyKeeper> {

    constructor(private keyKeeperService: KeyKeeperService) {
        super();
    }

    load(externalId: string, description: string) {
        this.loadingSubject.next(true);

        this.keyKeeperService.get(externalId, description)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<KeyKeeper>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
