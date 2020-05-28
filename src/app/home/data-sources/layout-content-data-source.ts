import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { LayoutContent } from '../api/models/notifications'
import { LayoutService } from '../api/services';

export class LayoutContentDataSource extends BaseDataSource<LayoutContent> {

    constructor(private layoutService: LayoutService) {
        super();
    }

    load(layoutId: string) {
        this.loadingSubject.next(true);

        this.layoutService.getContents(layoutId)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: LayoutContent[]) => {
                this.itemsSubject.next(response)
            });
    }
}
