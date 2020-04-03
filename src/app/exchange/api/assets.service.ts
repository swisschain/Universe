import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { Asset } from './models/assets/asset.interface';
import { PagedResponse } from './models/pagination/paged-response.interface';

const API_URL = 'exchange/api/asset/public-assets';

@Injectable()
export class AssetsService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<PagedResponse<Asset>>(`${API_URL}`)
            .pipe(
                map(result => result.items)
            );
    }

    get(assetId: string, isEnabled: boolean) {
        const params = new HttpParams()
            .set('assetId', assetId)
            .set('isEnabled', isEnabled === true ? 'true' : isEnabled === false ? 'false' : '');

        return this.http.get<PagedResponse<Asset>>(`${API_URL}`, { params: params });
    }

    getById(assetId: string) {
        return this.http.get<Asset>(`${API_URL}/${assetId}`);
    }

    add(asset: Asset) {
        return this.http.post(`${API_URL}`, {
            id: asset.id,
            name: asset.name,
            description: asset.description,
            accuracy: asset.accuracy,
            isDisabled: asset.isDisabled
        });
    }

    update(asset: Asset) {
        console.log(asset);
        return this.http.put(`${API_URL}`, {
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