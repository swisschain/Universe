import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { TradingFee, TradingFeeLevel } from '../models/fees';
import { Response } from '../models/response';
import { PagedResponse } from '../models/pagination/paged-response.interface';

const API_URL = 'exchange/api/fees/trading';

@Injectable()
export class TradingFeeService {
    constructor(private http: HttpClient) { }

    get(assetPair: string) {
        const params = new HttpParams()
            .set('assetPair', assetPair);

        return this.http.get<Response<PagedResponse<TradingFee>>>(`${API_URL}`, { params: params });
    }

    getById(tradingFeeId: string) {
        return this.http.get<Response<TradingFee>>(`${API_URL}/${tradingFeeId}`);
    }

    create(tradingFee: TradingFee) {
        return this.http.post(`${API_URL}`, {
            assetPair: tradingFee.assetPair,
            asset: tradingFee.asset
        });
    }

    update(tradingFee: TradingFee) {
        return this.http.put(`${API_URL}`, {
            id: tradingFee.id,
            asset: tradingFee.asset
        });
    }

    delete(tradingFeeId: string) {
        return this.http.delete(`${API_URL}/${tradingFeeId}`);
    }

    getLevels(tradingFeeId: string) {
        return this.http.get<Response<TradingFeeLevel[]>>(`${API_URL}/${tradingFeeId}/levels`);
    }

    addLevel(tradingFeeLevel: TradingFeeLevel) {
        return this.http.post(`${API_URL}/levels`, {
            tradingFeeId: tradingFeeLevel.tradingFeeId,
            volume: tradingFeeLevel.volume,
            makerFee: tradingFeeLevel.makerFee,
            takerFee: tradingFeeLevel.takerFee,
        });
    }

    updateLevel(tradingFeeLevel: TradingFeeLevel) {
        return this.http.put(`${API_URL}/levels`, {
            id: tradingFeeLevel.id,
            volume: tradingFeeLevel.volume,
            makerFee: tradingFeeLevel.makerFee,
            takerFee: tradingFeeLevel.takerFee,
        });
    }

    deleteLevel(tradingFeeLevelId: string) {
        return this.http.delete(`${API_URL}/levels/${tradingFeeLevelId}`);
    }
}
