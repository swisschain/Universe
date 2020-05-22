import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MarketOrderCreateResult } from '../models/orders';
import { LimitOrderType } from '../models/order-books';

const API_URL = 'exchange/api/operations/trading/market-order';

@Injectable()
export class MarketOrderService {
    constructor(private http: HttpClient) { }

    create(accountId: number, walletId: number, assetPair: string, type: LimitOrderType, volume: number) {
        return this.http.post<MarketOrderCreateResult>(`${API_URL}`, {
            accountId,
            walletId,
            assetPair,
            volume: type === LimitOrderType.Sell ? -volume : volume,
        });
    }
}
