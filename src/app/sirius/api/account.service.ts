import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Account } from './models/account/account.interface';
import { AccountRequisite } from './models/account/account-requisite.interface';
import { PagedResponse } from './models/pagination/paged-response.interface';

import { v4 as uuidv4 } from 'uuid';
import { of } from 'rxjs';
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
            .set('accountId', accountId.toString());
        return this.http.get<PagedResponse<Account>>(`${API_URL}`, { params: params })
            .pipe(
                map(result => {
                    return result.items[0];
                })
            );
    }

    getRequisites(brokerAccountId: number, blockchainId: string) {
        const params = new HttpParams()
            .set('blockchainId', blockchainId);

        return this.http.get<PagedResponse<AccountRequisite>>(`${API_URL}/${brokerAccountId}/requisites`, { params: params });
    }

    getRequisiteByAssetId(accountId: number, assetId: number) {
        return this.http.get<AccountRequisite>(`${API_URL}/${accountId}/requisites/by-asset-id/${assetId}`);
    }

    create(brokerAccountId: number, referenceId: string) {
        const headers = new HttpHeaders()
            .set('X-Request-ID', uuidv4());
        return this.http.post<Account>(`${API_URL}`, { brokerAccountId, referenceId }, { headers: headers });
    }
}
