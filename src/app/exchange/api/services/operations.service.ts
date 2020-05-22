import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_URL = 'exchange/api/operations';

@Injectable()
export class OperationsService {
    constructor(private http: HttpClient) { }

    cashIn(accountId: number, walletId: number, asset: string, volume: number, description: string) {
        return this.http.post(`${API_URL}/cash-management/cash-in`, {
            accountId,
            walletId,
            asset,
            volume,
            description
        });
    }

    cashOut(accountId: number, walletId: number, asset: string, volume: number, description: string) {
        return this.http.post(`${API_URL}/cash-management/cash-out`, {
            accountId,
            walletId,
            asset,
            volume,
            description
        });
    }

    transfer(accountId: number, asset: string, volume: number, fromWalletId: number, toWalletId: number, description: string) {
        return this.http.post(`${API_URL}/cash-management/transfer`, {
            accountId,
            fromWalletId,
            toWalletId,
            asset,
            volume,
            description
        });
    }
}
