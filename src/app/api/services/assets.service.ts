import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Asset } from '../models/asset.interface';
import { PagedResponse } from '../models/paged-response.interface';

const API_URL = 'api/assets';

@Injectable()
export class AssetsService {
    constructor(private http: HttpClient) { }

    getAll() {
        const params = new HttpParams()
            .set('pageNumber', '0')
            .set('pageSize', '1000');

        return this.http.get<PagedResponse<Asset>>(API_URL, { params: params });
    }

    get(filter: string, sortField: string, sortOrder: string, pageIndex: number, pageSize: number) {
        const params = new HttpParams()
            .set('filter', filter)
            .set('sortField', sortField)
            .set('sortOrder', sortOrder)
            .set('pageNumber', pageIndex.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get<PagedResponse<Asset>>(API_URL, { params: params });
    }

    add(asset: Asset) {
        return this.http.post(API_URL, {
            id: 'asset.id',
            name: asset.name,
            description: asset.description,
            accuracy: asset.accuracy,
            isDisabled: asset.isDisabled
        });
    }

    update(asset: Asset) {
        console.log(asset);
        return this.http.put(API_URL, {
            id: asset.id,
            name: asset.name,
            description: asset.description,
            accuracy: asset.accuracy,
            isDisabled: asset.isDisabled
        });
    }

    delete(assetId: string) {
        return this.http.delete(`${API_URL}/${assetId}`);
    }
}