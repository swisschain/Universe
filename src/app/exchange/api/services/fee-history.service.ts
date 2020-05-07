import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { CashOperationsFeeHistory } from '../models/fees';
import { Response } from '../models/response';
import { PagedResponse } from '../models/pagination/paged-response.interface';

const API_URL = 'exchange/api/fees/audit';

@Injectable()
export class FeeHistoryService {
    constructor(private http: HttpClient) { }

    getCashOperations(asset: string) {
        const params = new HttpParams()
            .set('asset', asset);

        return this.http.get<Response<PagedResponse<CashOperationsFeeHistory>>>(`${API_URL}/cash-operations`, { params: params });
    }
}
