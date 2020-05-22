import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Balance, BalanceHistory, BalanceHistoryType, BalanceHistoryDetails } from '../models/balances';
import { PagedResponse } from '../models/pagination';
import { Order } from '../models/orders';
import { Trade } from '../models/trades';

const API_URL = 'exchange/api/account-data';

@Injectable()
export class AccountDataService {
    constructor(private http: HttpClient) { }

    getBalances(accountId: number, walletId: number, asset: string) {
        const params = new HttpParams()
            .set('accountId', accountId.toString())
            .set('walletId', walletId ? walletId.toString() : '')
            .set('asset', asset);

        return this.http.get<PagedResponse<Balance>>(`${API_URL}/balance`, { params: params });
    }

    getBalanceHistory(accountId: number, walletId: number, asset: string, eventType: BalanceHistoryType) {
        const params = new HttpParams()
            .set('accountId', accountId.toString())
            .set('walletId', walletId.toString())
            .set('asset', asset)
            .set('eventType', eventType ? eventType.toString() : '')
            .set('order', 'desc');

        return this.http.get<PagedResponse<BalanceHistory>>(`${API_URL}/balance-update`, { params: params });
    }

    getBalanceHistoryDetails(balanceHistoryId: number) {
        return this.http.get<BalanceHistoryDetails>(`${API_URL}/balance-update/details/${balanceHistoryId}`);
    }

    getOrders(accountId: number, walletId: number, assetPair: string, orderType: string, side: string, status: string) {
        const params = new HttpParams()
            .set('accountId', accountId.toString())
            .set('walletId', walletId.toString())
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

    getTrades(accountId: number, walletId: number, baseAsset: string, quotingAsset: string) {
        const params = new HttpParams()
            .set('accountId', accountId.toString())
            .set('walletId', walletId.toString())
            .set('baseAssetId', baseAsset)
            .set('quotingAssetId', quotingAsset)
            .set('order', 'desc');

        return this.http.get<PagedResponse<Trade>>(`${API_URL}/trade`, { params: params });
    }

    getTradeById(tradeId: string) {
        return this.http.get<Trade>(`${API_URL}/trade/${tradeId}`);
    }
}
