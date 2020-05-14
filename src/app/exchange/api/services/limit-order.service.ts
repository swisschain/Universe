import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LimitOrderType } from '../models/order-books';
import { LimitOrderCreateResult } from '../models/orders';

const API_URL = 'exchange/api/operations/trading/limit-order';

@Injectable()
export class LimitOrderService {
    constructor(private http: HttpClient) { }

    create(symbol: string, walletId: string, type: LimitOrderType, price: number, volume: number, cancelPrevious: boolean) {
        return this.http.post<LimitOrderCreateResult>(`${API_URL}`, {
            symbol: symbol,
            walletId: walletId,
            type: 'limit',
            price: price,
            volume: type === LimitOrderType.Sell ? -volume : volume,
            cancelPrevious: cancelPrevious
        });
    }

    cancel(limitOrderId: string) {
        return this.http.delete(`${API_URL}/${limitOrderId}`, {});
    }
}
