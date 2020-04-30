import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { Withdrawal, WithdrawalState } from '../models/withdrawals';
import { PagedResponse } from '../models/pagination/paged-response.interface';

const API_URL = 'sirius/api/withdrawals';

@Injectable()
export class WithdrawalService {
    constructor(private http: HttpClient) { }

    get(brokerAccountId: number,
        accountId: number,
        referenceId: string,
        blockchainId: string,
        assetId: number,
        states: WithdrawalState[],
        transactionId: string,
        destinationAddress: string,
        destinationTag: string) {
        let params = new HttpParams()
            .set('brokerAccountId', brokerAccountId ? brokerAccountId.toString() : '')
            .set('accountId', accountId ? accountId.toString() : '')
            .set('referenceId', referenceId)
            .set('blockchainId', blockchainId)
            .set('assetId', assetId ? assetId.toString() : '')
            .set('transactionId', transactionId)
            .set('destinationAddress', destinationAddress)
            .set('destinationTag', destinationTag)
            .set('order', 'desc')
            .set('limit', '1000');

        if (states) {
            states.forEach(state => {
                params = params.append('state', state.toString());
            });
        }

        return this.http.get<PagedResponse<Withdrawal>>(`${API_URL}`, { params: params });
    }

    getById(withdrawalId: number) {
        const params = new HttpParams()
            .set('id', withdrawalId.toString());

        return this.http.get<PagedResponse<Withdrawal>>(`${API_URL}`, { params: params })
            .pipe(
                map(result => {
                    return result.items[0];
                })
            );
    }

    create(brokerAccountId: number, accountId: number, referenceId: string, assetId: number, amount: number, address: string, requestId: string) {
        const headers = new HttpHeaders()
            .set('X-Request-ID', requestId);
        return this.http.post<Withdrawal>(`${API_URL}`, {
            brokerAccountId,
            accountId,
            referenceId,
            assetId,
            amount,
            destinationDetails: {
                address
            }
        }, { headers: headers });
    }
}
