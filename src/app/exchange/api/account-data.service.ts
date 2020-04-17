import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { BalanceResponse } from './models/balances/balance-response.interface';
import { PagedResponse } from './models/pagination/paged-response.interface';
import { Order } from './models/orders/order.interface';
import { Trade } from './models/trades/trade.interface';
import { BalanceHistory } from './models/balances/balance-history.interface';

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

    getBalanceHistory(walletId: string, asset: string) {
        const params = new HttpParams()
            .set('walletId', walletId)
            .set('assetId', asset)
            .set('order', 'desc');

        return this.http.get<PagedResponse<BalanceHistory>>(`${API_URL}/balance-update`, { params: params });
    }

    getOrders(walletId: string, assetPair: string, orderType: string, side: string, status: string) {
        const params = new HttpParams()
            .set('walletId', walletId)
            .set('assetPairId', assetPair)
            .set('orderType', orderType)
            .set('side', side)
            .set('status', status)
            .set('order', 'desc');

        return this.http.get<PagedResponse<Order>>(`${API_URL}/order`, { params: params });
    }

    getOrderById(orderId: string) {
        return this.http.get<Order>(`${API_URL}/order/${orderId}`);
    }

    getTrades(walletId: string, baseAsset: string, quotingAsset: string) {
        const params = new HttpParams()
            .set('walletId', walletId)
            .set('baseAssetId', baseAsset)
            .set('quotingAssetId', quotingAsset)
            .set('order', 'desc');

        return this.http.get<PagedResponse<Trade>>(`${API_URL}/trade`, { params: params });
    }

    getTradeById(tradeId: string) {
        return this.http.get<Trade>(`${API_URL}/trade/${tradeId}`);
    }
}