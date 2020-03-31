import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BrockerAccountRequest } from './models/brocker-account/broker-account-request.intraface';
import { BrokerAccount } from './models/brocker-account/broker-account.interface';
import { PagedResponse } from './models/pagination/paged-response.interface';

import { v4 as uuidv4 } from 'uuid';

const API_URL = 'sirius/api/broker-accounts';

@Injectable()
export class BrokerAccountService {
    constructor(private http: HttpClient) { }

    get() {
        return this.http.get<PagedResponse<BrokerAccount>>(`${API_URL}`, {});
    }

    create(name: string) {
        const requstId = uuidv4();
        let  headers = new HttpHeaders();
        headers = headers.set('X-Request-ID', requstId);
        return this.http.post<BrokerAccount>(`${API_URL}`, {name}, { headers: headers });
    }

}