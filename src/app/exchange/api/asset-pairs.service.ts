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

    get(assetPairId: string, baseAssetId: string, quotingAssetId: string, isEnabled: boolean) {
        const params = new HttpParams()
            .set('assetPairId', assetPairId)
            .set('baseAssetId', baseAssetId)
            .set('quotingAssetId', quotingAssetId)
            .set('isEnabled', isEnabled ? 'true' : 'false');

        return this.http.get<PagedResponse<AssetPair>>(`${API_URL}`, { params: params });
    }

    getById(assetPairId: string) {
        return this.http.get<AssetPair>(`${API_URL}/${assetPairId}`);
    }

    add(assetPair: AssetPair) {
        return this.http.post(`${API_URL}`, {
            id: assetPair.id,
            name: assetPair.name,
            baseAssetId: assetPair.baseAssetId,
            quotingAssetId: assetPair.quotingAssetId,
            accuracy: assetPair.accuracy,
            minVolume: assetPair.minVolume,
            maxVolume: assetPair.maxVolume,
            maxOppositeVolume: assetPair.maxVolume,
            marketOrderPriceThreshold: assetPair.maxVolume,
            isDisabled: assetPair.isDisabled
        });
    }

    update(assetPair: AssetPair) {
        return this.http.put(`${API_URL}`, {
            id: assetPair.id,
            name: assetPair.name,
            baseAssetId: assetPair.baseAssetId,
            quotingAssetId: assetPair.quotingAssetId,
            accuracy: assetPair.accuracy,
            minVolume: assetPair.minVolume,
            maxVolume: assetPair.maxVolume,
            maxOppositeVolume: assetPair.maxVolume,
            marketOrderPriceThreshold: assetPair.maxVolume,
            isDisabled: assetPair.isDisabled
        });
    }

    delete(assetPairId: string) {
        return this.http.delete(`${API_URL}/${assetPairId}`);
    }
}