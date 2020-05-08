import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { ApiKey, Vault, VaultType } from '../models/vaults';
import { PagedResponse } from '../models/pagination/paged-response.interface';

const API_URL = 'sirius/api/vaults';

@Injectable()
export class VaultService {
    constructor(private http: HttpClient) { }

    get(name: string, type: VaultType) {
        const params = new HttpParams()
            .set('name', name)
            .set('type', type ? type.toString() : '');
        return this.http.get<PagedResponse<Vault>>(`${API_URL}`, { params: params });
    }

    getById(vaultId: number) {
        const params = new HttpParams()
            .set('id', vaultId.toString());

        return this.http.get<PagedResponse<Vault>>(`${API_URL}`, { params: params })
            .pipe(
                map(result => {
                    return result.items[0];
                })
            );
    }

    create(name: string, type: VaultType, requestId: string) {
        const headers = new HttpHeaders()
            .set('X-Request-ID', requestId);
        return this.http.post<Vault>(`${API_URL}`, { name, type }, { headers: headers });
    }

    update(vaultId: number, name: string, requestId: string) {
        const headers = new HttpHeaders()
            .set('X-Request-ID', requestId);
        return this.http.put<Vault>(`${API_URL}`, { id: vaultId, name }, { headers: headers });
    }

    getApiKeys(vaultId: number, name: string, isRevoked: boolean) {
        const params = new HttpParams()
            .set('name', name)
            .set('isRevoked', isRevoked === true ? 'true' : isRevoked === false ? 'false' : '');

        return this.http.get<PagedResponse<ApiKey>>(`${API_URL}/${vaultId}/api-keys`, { params: params });
    }

    getApiKeyById(vaultId: number, apiKeyId: number) {
        const params = new HttpParams()
            .set('id', apiKeyId.toString());

        return this.http.get<PagedResponse<ApiKey>>(`${API_URL}/${vaultId}/api-keys`, { params: params })
            .pipe(
                map(result => {
                    return result.items[0];
                })
            );
    }

    addApiKey(vaultId: number, name: string, expiresAt: Date, requestId: string) {
        const headers = new HttpHeaders()
            .set('X-Request-ID', requestId);
        return this.http.post<ApiKey>(`${API_URL}/${vaultId}/api-keys`, { name, expiresAt }, { headers: headers })
    }
}
