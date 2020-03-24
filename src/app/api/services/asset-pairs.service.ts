import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AssetPair } from '../models/asset-pair.interface';
import { PagedResponse } from '../models/paged-response.interface';

const API_URL = 'api/assetPairs';

@Injectable()
export class AssetPairsService {
    constructor(private http: HttpClient) { }

    getAll() {
        const params = new HttpParams()
            .set('pageNumber', '0')
            .set('pageSize', '1000');

        return this.http.get<PagedResponse<AssetPair>>(API_URL, { params: params });
    }

    get(filter: string, sortField: string, sortOrder: string, pageIndex: number, pageSize: number) {
        const params = new HttpParams()
            .set('filter', filter)
            .set('sortField', sortField)
            .set('sortOrder', sortOrder)
            .set('pageNumber', pageIndex.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get<PagedResponse<AssetPair>>(API_URL, { params: params });
    }

    getById(assetPairId: string) {
        return this.http.get<AssetPair>(`${API_URL}/${assetPairId}`);
    }

    add(assetPair: AssetPair) {
        return this.http.post(API_URL, {
            id: 'assetPair.id',
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
        return this.http.put(API_URL, {
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