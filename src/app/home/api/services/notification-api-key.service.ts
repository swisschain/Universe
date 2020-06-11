import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { NotificationApiKey, Product, Channel } from '../models/notifications';

const API_URL = 'quasar/api/api-keys';

@Injectable()
export class NotificationApiKeyService {
    constructor(private http: HttpClient) { }

    get() {
        return this.http.get<NotificationApiKey[]>(`${API_URL}`);
    }

    add(providerId: string, product: Product, channel: Channel, from: string, value: string) {
        return this.http.post<NotificationApiKey>(`${API_URL}`, {
            providerId,
            product,
            channel,
            from,
            value
        });
    }

    update(id: string, providerId: string, product: Product, channel: Channel, from: string, value: string) {
        return this.http.put<NotificationApiKey>(`${API_URL}`, {
            id,
            providerId,
            product,
            channel,
            from,
            value
        });
    }

    delete(id: string) {
        return this.http.delete(`${API_URL}/${id}`);
    }
}
