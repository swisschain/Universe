import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { AssetPair } from './models/asset-pairs/asset-pair.interface';
import { PagedResponse } from './models/pagination/paged-response.interface';

const API_URL = 'exchange/api/asset/asset-pairs';

@Injectable()
export class AssetPairsService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<PagedResponse<AssetPair>>(`${API_URL}`)
            .pipe(
                map(result => result.items)
            );
    }

    get(symbol: string, baseAsset: string, quotingAsset: string, IsDisabled: boolean) {
        const params = new HttpParams()
            .set('symbol', symbol)
            .set('baseAsset', baseAsset)
            .set('quotingAsset', quotingAsset)
            .set('IsDisabled', IsDisabled === true ? 'true' : IsDisabled === false ? 'false' : '');

        return this.http.get<PagedResponse<AssetPair>>(`${API_URL}`, { params: params });
    }

    getBySymbol(symbol: string) {
        return this.http.get<AssetPair>(`${API_URL}/${symbol}`);
    }

    add(assetPair: AssetPair) {
        return this.http.post(`${API_URL}`, {
            symbol: assetPair.symbol,
            baseAsset: assetPair.baseAsset,
            quotingAsset: assetPair.quotingAsset,
            accuracy: assetPair.accuracy,
            minVolume: assetPair.minVolume,
            maxVolume: assetPair.maxVolume,
            maxOppositeVolume: assetPair.maxOppositeVolume,
            marketOrderPriceThreshold: assetPair.marketOrderPriceThreshold,
            isDisabled: assetPair.isDisabled
        });
    }

    update(assetPair: AssetPair) {
        return this.http.put(`${API_URL}`, {
            symbol: assetPair.symbol,
            baseAsset: assetPair.baseAsset,
            quotingAsset: assetPair.quotingAsset,
            accuracy: assetPair.accuracy,
            minVolume: assetPair.minVolume,
            maxVolume: assetPair.maxVolume,
            maxOppositeVolume: assetPair.maxOppositeVolume,
            marketOrderPriceThreshold: assetPair.marketOrderPriceThreshold,
            isDisabled: assetPair.isDisabled
        });
    }

    delete(symbol: string) {
        return this.http.delete(`${API_URL}/${symbol}`);
    }
}