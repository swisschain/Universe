import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Blockchain } from './models/blockchains/blockchain.interface';
import { PagedResponse } from './models/pagination/paged-response.interface';

const API_URL = 'sirius/api/blockchains';

@Injectable()
export class BlockchainsService {
    constructor(private http: HttpClient) { }

    get() {
        return this.http.get<PagedResponse<Blockchain>>(`${API_URL}`);
    }

    getById(blockchainId: string) {
        const params = new HttpParams()
            .set('blockchainId', blockchainId);

        return this.http.get<PagedResponse<Blockchain>>(`${API_URL}`, { params: params })
            .pipe(
                map(result => {
                    return result.items[0];
                })
            );
    }
}