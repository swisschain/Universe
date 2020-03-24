import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OrderBookListItem } from '../models/order-book-list-item.interface';
import { OrderBook } from '../models/order-book.interface';

const API_URL = 'api/orderBooks';

@Injectable()
export class OrderBooksService {
    constructor(private http: HttpClient) { }

    get() {
        const params = new HttpParams();
        return this.http.get<OrderBookListItem[]>(`${API_URL}`, { params: params });
    }

    getByAssetPairId(assetPairId: string) {
        const params = new HttpParams();
        return this.http.get<OrderBook>(`${API_URL}/${assetPairId}`, { params: params });
    }
}