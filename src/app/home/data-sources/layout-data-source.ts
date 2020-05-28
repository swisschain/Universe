import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { Layout, Product } from '../api/models/notifications'
import { LayoutService } from '../api/services';

export class LayoutDataSource extends BaseDataSource<Layout> {

    constructor(private layoutService: LayoutService) {
        super();
    }

    load(product: Product) {
        this.loadingSubject.next(true);

        this.layoutService.get(product)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: Layout[]) => {
                this.itemsSubject.next(response)
            });
    }
}
