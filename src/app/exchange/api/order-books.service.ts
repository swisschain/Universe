import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { OrderBook } from './models/order-books/order-book.interface';

const API_URL = 'exchange/api/books/order-books';

@Injectable()
export class OrderBooksService {
    constructor(private http: HttpClient) { }

    get() {
        return this.http.get<OrderBook[]>(`${API_URL}`);
    }

    getByAssetPairId(assetPairId: string) {
        return this.http.get<OrderBook>(`${API_URL}/${assetPairId}`);
    }
}
