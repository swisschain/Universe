import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { Account } from '../models/accounts';
import { PagedResponse } from '../models/pagination';

const API_URL = 'exchange/api/accounts/account';

@Injectable()
export class AccountService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<PagedResponse<Account>>(`${API_URL}`)
            .pipe(
                map(result => result.items)
            );
    }

    get(name: string, isDisabled: boolean) {
        const params = new HttpParams()
            .set('name', name)
            .set('isDisabled', isDisabled === true ? 'true' : isDisabled === false ? 'false' : '');

        return this.http.get<PagedResponse<Account>>(`${API_URL}`, { params: params });
    }

    getById(accountId: string) {
        return this.http.get<Account>(`${API_URL}/${accountId}`);
    }

    add(name: string, isDisabled: boolean) {
        return this.http.post(`${API_URL}`, {
            name,
            isDisabled
        });
    }

    update(accountId: string, name: string, isDisabled: boolean) {
        return this.http.put(`${API_URL}`, {
            id: accountId,
            name,
            isDisabled
        });
    }

    delete(accountId: string) {
        return this.http.delete(`${API_URL}/${accountId}`);
    }
}