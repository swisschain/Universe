import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { Asset } from './models/assets/asset.interface';
import { PagedResponse } from './models/pagination/paged-response.interface';

const API_URL = 'exchange/api/asset/assets';

@Injectable()
export class AssetsService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<PagedResponse<Asset>>(`${API_URL}`)
            .pipe(
                map(result => result.items)
            );
    }

    get(symbol: string, IsDisabled: boolean) {
        const params = new HttpParams()
            .set('symbol', symbol)
            .set('IsDisabled', IsDisabled === true ? 'true' : IsDisabled === false ? 'false' : '');

        return this.http.get<PagedResponse<Asset>>(`${API_URL}`, { params: params });
    }

    getBySymbol(symbol: string) {
        return this.http.get<Asset>(`${API_URL}/${symbol}`);
    }

    add(asset: Asset) {
        return this.http.post(`${API_URL}`, {
            symbol: asset.symbol,
            description: asset.description,
            accuracy: asset.accuracy,
            isDisabled: asset.isDisabled
        });
    }

    update(asset: Asset) {
        return this.http.put(`${API_URL}`, {
            symbol: asset.symbol,
            description: asset.description,
            accuracy: asset.accuracy,
            isDisabled: asset.isDisabled
        });
    }

    delete(symbol: string) {
        return this.http.delete(`${API_URL}/${symbol}`);
    }
}