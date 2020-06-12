import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Message, MessageStatus, Product, Channel } from '../models/notifications';
import { PagedResponse } from '../models/pagination';

const API_URL = 'quasar/api/messages';

@Injectable()
export class MessageService {
    constructor(private http: HttpClient) { }

    get(product: Product, channel: Channel, status: MessageStatus, templateName: string, address: string) {
        let params = new HttpParams()
            //.set('product', product ? product.toString() : '')
            //.set('channel', channel ? channel.toString() : '')
            //.set('status', status ? status.toString() : '')
            .set('templateName', templateName)
            .set('address', address);

        if (product) {
            params = params.set('product', product.toString());
        }

        if (channel) {
            params = params.set('channel', channel.toString());
        }

        if (status) {
            params = params.set('status', status.toString());
        }

        return this.http.get<PagedResponse<Message>>(`${API_URL}`, { params });
    }
}
