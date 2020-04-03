import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { BrokerAccount } from './models/brocker-account/broker-account.interface';
import { BrokerBalance } from './models/broker-balances/broker-balance.interface';
import { BrokerAccountRequisite } from './models/brocker-account/broker-account-requisite.interface';
import { PagedResponse } from './models/pagination/paged-response.interface';

import { v4 as uuidv4 } from 'uuid';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';


const API_URL = 'sirius/api/broker-accounts';

@Injectable()
export class BrokerAccountService {
    constructor(private http: HttpClient) { }

    get() {
        return this.http.get<PagedResponse<BrokerAccount>>(`${API_URL}`, {});
    }

    getById(brokerAccountId: number) {
        const params = new HttpParams()
            .set('brokerAccountId', brokerAccountId.toString());

        return this.http.get<PagedResponse<BrokerAccount>>(`${API_URL}`, { params: params })
            .pipe(
                map(result => {
                    return result.items[0];
                })
            );
    }

    getRequisites(brokerAccountId: number, assetId: number) {
        return this.http.get<BrokerAccountRequisite>(`${API_URL}/${brokerAccountId}/requisites/by-asset-id/${assetId}`);
    }

    getBalances(brokerAccountId: number) {
        return this.http.get<PagedResponse<BrokerBalance>>(`${API_URL}/${brokerAccountId}/balances`);
    }

    create(name: string) {
        const requstId = uuidv4();
        let headers = new HttpHeaders();
        headers = headers.set('X-Request-ID', requstId);
        return this.http.post<BrokerAccount>(`${API_URL}`, { name }, { headers: headers });
    }

}