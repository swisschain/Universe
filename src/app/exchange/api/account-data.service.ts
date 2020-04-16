import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { BalanceResponse } from './models/balances/balance-response.interface';
import { PagedResponse } from './models/pagination/paged-response.interface';
import { Order } from './models/orders/order.interface';

const API_URL = 'exchange/api/account-data';

@Injectable()
export class AccountDataService {
    constructor(private http: HttpClient) { }

    getBalances(walletId: string) {
        return this.http.get<BalanceResponse>(`${API_URL}/balance/${walletId}`)
            .pipe(
                map(result => result.list)
            );
    }

    getOrders(walletId: string, assetPair: string, orderType: string, side: string, status: string) {
        const params = new HttpParams()
            .set('walletId', walletId)
            .set('assetPairId', assetPair)
            .set('orderType', orderType)
            .set('side', side)
            .set('status', status);

        return this.http.get<PagedResponse<Order>>(`${API_URL}/order`, { params: params });
    }

    getOrderById(orderId: string) {
        return this.http.get<Order>(`${API_URL}/order/${orderId}`);
    }
}