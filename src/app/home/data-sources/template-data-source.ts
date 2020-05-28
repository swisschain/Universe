import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { Template, Product } from '../api/models/notifications'
import { TemplateService } from '../api/services';

export class TemplateDataSource extends BaseDataSource<Template> {

    constructor(private templateService: TemplateService) {
        super();
    }

    load(name: string, product: Product) {
        this.loadingSubject.next(true);

        this.templateService.get(name, product)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: Template[]) => {
                this.itemsSubject.next(response)
            });
    }
}
