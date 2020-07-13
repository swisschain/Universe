import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { Asset } from '../models/assets';
import { PagedResponse } from '../models/pagination/paged-response.interface';

const API_URL = 'sirius/api/assets';

@Injectable()
export class AssetsService {
    constructor(private http: HttpClient) { }

    getAll() {
        const params = new HttpParams()
            .set('limit', '1000');
        return this.http.get<PagedResponse<Asset>>(`${API_URL}`, {params});
    }

    get(symbol: string, blockchainId: string) {
        const params = new HttpParams()
            .set('symbol', symbol)
            .set('blockchainId', blockchainId);
        return this.http.get<PagedResponse<Asset>>(`${API_URL}`, { params });
    }

    getById(assetId: number) {
        const params = new HttpParams()
            .set('id', assetId.toString());
        return this.http.get<PagedResponse<Asset>>(`${API_URL}`, { params })
            .pipe(
                map(result => {
                    return result.items[0];
                })
            );
    }
}
