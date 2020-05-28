import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { TemplateContent, Channel } from '../api/models/notifications'
import { TemplateService } from '../api/services';

export class TemplateContentDataSource extends BaseDataSource<TemplateContent> {

    constructor(private templateService: TemplateService) {
        super();
    }

    load(templateId: string, channel: Channel) {
        this.loadingSubject.next(true);

        this.templateService.getContents(templateId, channel)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: TemplateContent[]) => {
                this.itemsSubject.next(response)
            });
    }
}
