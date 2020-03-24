import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Balance } from '../models/balance.interface';
import { PagedResponse } from '../models/paged-response.interface';

const API_URL = 'api/wallets';

@Injectable()
export class BalancesService {
    constructor(private http: HttpClient) { }

    get(walletId: string, sortField: string, sortOrder: string, pageIndex: number, pageSize: number) {
        const params = new HttpParams()
            .set('sortField', sortField)
            .set('sortOrder', sortOrder)
            .set('pageNumber', pageIndex.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get<PagedResponse<Balance>>(`${API_URL}/${walletId}`, { params: params });
    }

    cashIn(walletId: string, assetId: string, amount: number) {
        return this.http.post(`${API_URL}/cash-in`, {
            walletId: walletId,
            assetId: assetId,
            amount: amount
        });
    }

    cashOut(walletId: string, assetId: string, amount: number) {
        return this.http.post(`${API_URL}/cash-out`, {
            walletId: walletId,
            assetId: assetId,
            amount: amount
        });
    }
}