import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_URL = 'exchange/api/operations';

@Injectable()
export class OperationsService {
    constructor(private http: HttpClient) { }

    cashIn(wallet: string, asset: string, volume: number, description: string) {
        return this.http.post(`${API_URL}/cash-management/cash-in`, {
            wallet,
            asset,
            volume,
            description
        });
    }

    cashOut(wallet: string, asset: string, volume: number, description: string) {
        return this.http.post(`${API_URL}/cash-management/cash-out`, {
            wallet,
            asset,
            volume,
            description
        });
    }
}