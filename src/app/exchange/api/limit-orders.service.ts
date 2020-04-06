import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LimitOrderType } from './models/order-books/limit-order-type.enum';
import { LimitOrderCreateResult } from './models/orders/limit-order-create-result.interface';

const API_URL = 'exchange/api/operations/trading/limit-order';

@Injectable()
export class LimitOrdersService {
    constructor(private http: HttpClient) { }

    create(assetPairId: string, walletId: string, type: LimitOrderType, price: number, volume: number, cancelPrevious: boolean) {
        return this.http.post<LimitOrderCreateResult>(`${API_URL}`, {
            assetPairId: assetPairId,
            walletId: walletId,
            type: type,
            price: price,
            volume: volume,
            cancelPrevious: cancelPrevious
        });
    }

    cancel(limitOrderId: string) {
        return this.http.delete(`${API_URL}/${limitOrderId}`, {});
    }
}
