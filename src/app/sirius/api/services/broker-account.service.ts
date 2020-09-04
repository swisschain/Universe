import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { BrokerAccount, BrokerBalance, BrokerAccountRequisite } from '../models/brocker-accounts';
import { PagedResponse } from '../models/pagination/paged-response.interface';

const API_URL = 'sirius/api/broker-accounts';

@Injectable()
export class BrokerAccountService {
    constructor(private http: HttpClient) { }

    get(name: string = '') {
        const params = new HttpParams()
            .set('name', name)
            .set('limit', '100');
        return this.http.get<PagedResponse<BrokerAccount>>(`${API_URL}`, { params });
    }

    getById(brokerAccountId: number) {
        const params = new HttpParams()
            .set('id', brokerAccountId.toString());

        return this.http.get<PagedResponse<BrokerAccount>>(`${API_URL}`, { params })
            .pipe(
                map(result => {
                    return result.items[0];
                })
            );
    }

    getRequisites(brokerAccountId: number, blockchainId: string) {
        const params = new HttpParams()
            .set('blockchainId', blockchainId);

        return this.http.get<PagedResponse<BrokerAccountRequisite>>(`${API_URL}/${brokerAccountId}/details`, { params });
    }

    getRequisiteByAssetId(brokerAccountId: number, assetId: number) {
        return this.http.get<BrokerAccountRequisite>(`${API_URL}/${brokerAccountId}/details/by-asset-id/${assetId}`);
    }

    getBalance(brokerAccountId: number, assetId: number) {
        const params = new HttpParams()
            .set('assetId', assetId.toString());
        return this.http.get<PagedResponse<BrokerBalance>>(`${API_URL}/${brokerAccountId}/balances`, { params })
            .pipe(
                map(result => {
                    return result.items.length > 0 ? result.items[0] : null;
                })
            );
    }

    getBalances(brokerAccountId: number) {
        return this.http.get<PagedResponse<BrokerBalance>>(`${API_URL}/${brokerAccountId}/balances`);
    }

    create(name: string, vaultId: number, requestId: string) {
        const headers = new HttpHeaders()
            .set('X-Request-ID', requestId);
        return this.http.post<BrokerAccount>(`${API_URL}`, { name, vaultId }, { headers });
    }
}
