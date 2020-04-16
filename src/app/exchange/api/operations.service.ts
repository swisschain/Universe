import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_URL = 'exchange/api/operations';

@Injectable()
export class OperationsService {
    constructor(private http: HttpClient) { }

    cashIn(walletId: string, asset: string, amount: number) {
        return this.http.post(`${API_URL}/cash-management/cash-in`, {
            clientId: walletId,
            symbol: asset,
            amount: amount
        });
    }

    cashOut(walletId: string, asset: string, amount: number) {
        return this.http.post(`${API_URL}/cash-management/cash-out`, {
            clientId: walletId,
            symbol: asset,
            amount: amount
        });
    }
}