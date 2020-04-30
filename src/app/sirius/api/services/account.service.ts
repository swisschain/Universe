import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Account, AccountRequisite } from '../models/accounts';
import { PagedResponse } from '../models/pagination/paged-response.interface';

import { map } from 'rxjs/operators';

const API_URL = 'sirius/api/accounts';

@Injectable()
export class AccountService {
    constructor(private http: HttpClient) { }

    get(brokerAccountId: number, referenceId: string) {
        const params = new HttpParams()
            .set('brokerAccountId', brokerAccountId ? brokerAccountId.toString() : '')
            .set('referenceId', referenceId);
        return this.http.get<PagedResponse<Account>>(`${API_URL}`, { params: params });
    }

    getById(accountId: number) {
        const params = new HttpParams()
            .set('id', accountId.toString());
        return this.http.get<PagedResponse<Account>>(`${API_URL}`, { params: params })
            .pipe(
                map(result => {
                    return result.items[0];
                })
            );
    }

    getRequisites(accountId: number, blockchainId: string) {
        const params = new HttpParams()
            .set('blockchainId', blockchainId);

        return this.http.get<PagedResponse<AccountRequisite>>(`${API_URL}/${accountId}/details`, { params: params });
    }

    getRequisiteByAssetId(accountId: number, assetId: number) {
        return this.http.get<AccountRequisite>(`${API_URL}/${accountId}/details/by-asset-id/${assetId}`);
    }

    create(brokerAccountId: number, referenceId: string, requestId: string) {
        const headers = new HttpHeaders()
            .set('X-Request-ID', requestId);
        return this.http.post<Account>(`${API_URL}`, { brokerAccountId, referenceId }, { headers: headers });
    }
}
