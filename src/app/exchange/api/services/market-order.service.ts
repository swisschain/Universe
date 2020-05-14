import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MarketOrderCreateResult } from '../models/orders';
import { LimitOrderType } from '../models/order-books';

const API_URL = 'exchange/api/operations/trading/market-order';

@Injectable()
export class MarketOrderService {
    constructor(private http: HttpClient) { }

    create(symbol: string, type: LimitOrderType, walletId: string, volume: number) {
        return this.http.post<MarketOrderCreateResult>(`${API_URL}`, {
            symbol,
            walletId,
            volume: type === LimitOrderType.Sell ? -volume : volume,
        });
    }
}
