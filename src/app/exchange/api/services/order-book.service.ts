import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { OrderBook } from '../models/order-books';
import { PagedResponse } from '../models/pagination';

const API_URL = 'exchange/api/books/order-books';

@Injectable()
export class OrderBookService {
    constructor(private http: HttpClient) { }

    get() {
        return this.http.get<PagedResponse<OrderBook>>(`${API_URL}`);
    }

    getByAssetPair(symbol: string) {
        return this.http.get<OrderBook>(`${API_URL}/${symbol}`);
    }
}
