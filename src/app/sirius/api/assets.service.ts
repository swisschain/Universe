import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Asset } from './models/assets/asset.interface';
import { PagedResponse } from './models/pagination/paged-response.interface';

const API_URL = 'sirius/api/assets';

@Injectable()
export class AssetsService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<PagedResponse<Asset>>(`${API_URL}`);
    }

    get(symbol: string, blockchainId: string) {
        const params = new HttpParams()
            .set('symbol', symbol)
            .set('blockchainId', blockchainId);
        return this.http.get<PagedResponse<Asset>>(`${API_URL}`, { params: params });
    }
}