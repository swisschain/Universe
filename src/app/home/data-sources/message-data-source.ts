import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { Message, MessageStatus, Product, Channel } from '../api/models/notifications';
import { MessageService } from '../api/services';
import { PagedResponse } from '../api/models/pagination';

export class MessageDataSource extends BaseDataSource<Message> {

    constructor(private messageService: MessageService) {
        super();
    }

    load(product: Product, channel: Channel, status: MessageStatus, templateName: string, address: string) {
        this.loadingSubject.next(true);

        this.messageService.get(product, channel, status, templateName, address)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<Message>) => {
                this.itemsSubject.next(response.items);
            });
    }
}
