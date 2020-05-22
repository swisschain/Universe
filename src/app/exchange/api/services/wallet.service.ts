import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { Wallet, WalletType } from '../models/wallets';
import { PagedResponse } from '../models/pagination';

const API_URL = 'exchange/api/accounts/wallet';

@Injectable()
export class WalletService {
    constructor(private http: HttpClient) { }

    getAll(accountId: number) {
        const params = new HttpParams()
            .set('accountId', accountId.toString());

        return this.http.get<PagedResponse<Wallet>>(`${API_URL}`, { params: params })
            .pipe(
                map(result => result.items)
            );
    }

    get(accountId: number, name: string, isEnabled: boolean, type: WalletType) {
        let params = new HttpParams()
            .set('accountId', accountId.toString())
            .set('name', name);

        if (type)
            params = params.set('type', type ? type.toString() : '')

        if (isEnabled)
            params = params.set('isEnabled', isEnabled === true ? 'true' : isEnabled === false ? 'false' : '');

        return this.http.get<PagedResponse<Wallet>>(`${API_URL}`, { params: params });
    }

    getById(walletId: number) {
        return this.http.get<Wallet>(`${API_URL}/${walletId}`);
    }

    add(name: string, accountId: number, isEnabled: boolean, type: WalletType) {
        return this.http.post(`${API_URL}`, {
            name,
            accountId,
            isEnabled,
            type
        });
    }

    update(walletId: number, name: string, isEnabled: boolean) {
        return this.http.put(`${API_URL}`, {
            id: walletId,
            name,
            isEnabled
        });
    }
}
