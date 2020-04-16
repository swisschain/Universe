import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MarketOrderCreateResult } from './models/orders/market-order-create-result.interface';
import { LimitOrderType } from './models/order-books/limit-order-type.enum';

const API_URL = 'exchange/api/operations/trading/market-order';

@Injectable()
export class MarketOrdersService {
    constructor(private http: HttpClient) { }

    create(symbol: string, type: LimitOrderType, walletId: string, volume: number) {
        return this.http.post<MarketOrderCreateResult>(`${API_URL}`, {
            symbol,
            walletId,
            volume: type === LimitOrderType.Sell ? -volume : volume,
        });
    }
}
