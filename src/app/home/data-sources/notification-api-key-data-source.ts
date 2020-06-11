import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { NotificationApiKey } from '../api/models/notifications';
import { NotificationApiKeyService } from '../api/services';

export class NotificationApiKeyDataSource extends BaseDataSource<NotificationApiKey> {

    constructor(private notificationApiKeyService: NotificationApiKeyService) {
        super();
    }

    load() {
        this.loadingSubject.next(true);

        this.notificationApiKeyService.get()
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: NotificationApiKey[]) => {
                this.itemsSubject.next(response);
            });
    }
}
