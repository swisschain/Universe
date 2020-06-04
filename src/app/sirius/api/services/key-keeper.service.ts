import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { KeyKeeper } from '../models/key-keepers';
import { PagedResponse } from '../models/pagination/paged-response.interface';

const API_URL = 'sirius/api/key-keepers';

@Injectable()
export class KeyKeeperService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<PagedResponse<KeyKeeper>>(`${API_URL}`)
            .pipe(
                map(result => {
                    return result.items;
                })
            );
    }

    get(externalId: string, description: string) {
        const params = new HttpParams()
            .set('externalId', externalId)
            .set('description', description);
        return this.http.get<PagedResponse<KeyKeeper>>(`${API_URL}`, { params: params });
    }

    getById(keyKeeperId: number) {
        const params = new HttpParams()
            .set('id', keyKeeperId.toString());

        return this.http.get<PagedResponse<KeyKeeper>>(`${API_URL}`, { params: params })
            .pipe(
                map(result => {
                    return result.items[0];
                })
            );
    }

    create(externalId: string, description: string, requestId: string) {
        const headers = new HttpHeaders()
            .set('X-Request-ID', requestId);
        return this.http.post<KeyKeeper>(`${API_URL}`, { externalId, description }, { headers: headers });
    }

    update(keyKeeperId: number, description: string, requestId: string) {
        const headers = new HttpHeaders()
            .set('X-Request-ID', requestId);
        return this.http.put<KeyKeeper>(`${API_URL}`, { id: keyKeeperId, description }, { headers: headers });
    }
}
