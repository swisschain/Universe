import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { CashOperationsFee } from '../models/fees';
import { Response } from '../models/response';
import { PagedResponse } from '../models/pagination/paged-response.interface';

const API_URL = 'exchange/api/fees/cash-operations';

@Injectable()
export class FeeService {
    constructor(private http: HttpClient) { }

    get(asset: string) {
        const params = new HttpParams()
            .set('asset', asset);

        return this.http.get<Response<PagedResponse<CashOperationsFee>>>(`${API_URL}`, { params: params });
    }

    getById(cashOperationsFeeId: string) {
        return this.http.get<Response<CashOperationsFee>>(`${API_URL}/${cashOperationsFeeId}`);
    }

    create(cashOperationsFee: CashOperationsFee) {
        return this.http.post(`${API_URL}`, {
            asset: cashOperationsFee.asset,
            cashInValue: cashOperationsFee.cashInValue,
            cashInFeeType: cashOperationsFee.cashInFeeType,
            cashOutValue: cashOperationsFee.cashOutValue,
            cashOutFeeType: cashOperationsFee.cashOutFeeType,
            cashTransferValue: cashOperationsFee.cashTransferValue,
            cashTransferFeeType: cashOperationsFee.cashTransferFeeType
        });
    }

    update(cashOperationsFee: CashOperationsFee) {
        return this.http.put(`${API_URL}`, {
            id: cashOperationsFee.id,
            cashInValue: cashOperationsFee.cashInValue,
            cashInFeeType: cashOperationsFee.cashInFeeType,
            cashOutValue: cashOperationsFee.cashOutValue,
            cashOutFeeType: cashOperationsFee.cashOutFeeType,
            cashTransferValue: cashOperationsFee.cashTransferValue,
            cashTransferFeeType: cashOperationsFee.cashTransferFeeType
        });
    }

    delete(cashOperationsFeeId: string) {
        return this.http.delete(`${API_URL}/${cashOperationsFeeId}`);
    }
}
