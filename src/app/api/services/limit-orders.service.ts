import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LimitOrderType } from '../models/limit-order-type.enum';
import { LimitOrderCreateResult } from '../models/limit-order-create-result.interface';

const API_URL = 'api/limitOrders';

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

    cancel(limitOrderId: string){
        return this.http.delete(`${API_URL}/${limitOrderId}`, {});
    }
}