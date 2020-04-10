import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Deposit } from './models/deposits/deposit.interface';
import { PagedResponse } from './models/pagination/paged-response.interface';
import { DepositState } from './models/deposits/deposit-state.enum';

const API_URL = 'sirius/api/deposits';

@Injectable()
export class DepositsService {
    constructor(private http: HttpClient) { }

    get(brokerAccountId: number, accountId: number, referenceId: string, blockchainId: string, assetId: number, states: DepositState[]) {
        let params = new HttpParams()
            .set('brokerAccountId', brokerAccountId ? brokerAccountId.toString() : '')
            .set('accountId', accountId ? accountId.toString() : '')
            .set('referenceId', referenceId)
            .set('blockchainId', blockchainId)
            .set('assetId', assetId ? assetId.toString() : '')
            .set('order', 'desc')
            .set('limit', '1000');

        if (states) {
            states.forEach(state => {
                params = params.append('state', state.toString());
            });
        }

        return this.http.get<PagedResponse<Deposit>>(`${API_URL}`, { params: params });
    }

    getById(depositId: number) {
        const params = new HttpParams()
            .set('id', depositId.toString());

        return this.http.get<PagedResponse<Deposit>>(`${API_URL}`, { params: params })
            .pipe(
                map(result => {
                    return result.items[0];
                })
            );
    }
}