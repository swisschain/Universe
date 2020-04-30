import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ApiKey } from '../models/api-keys/api-key.interface';
import { ApiKeyToken } from '../models/api-keys/api-key-token.interface';
import { Product } from '../models/api-keys/product.enum';

const API_URL = 'api/api-keys';

@Injectable()
export class ApiKeyService {
    constructor(private http: HttpClient) { }

    get(searchValue: string, isDeleted: boolean, product: Product) {
        const params = new HttpParams()
            .set('searchValue', searchValue)
            .set('isDeleted', isDeleted === true ? 'true' : isDeleted === false ? 'false' : '')
            .set('product', product ? product.toString() : '');
        return this.http.get<ApiKey[]>(`${API_URL}`, { params: params });
    }

    getById(apiKeyId: string) {
        return this.http.get<ApiKey>(`${API_URL}/${apiKeyId}`);
    }

    getToken(apiKeyId: string) {
        return this.http.get<ApiKeyToken>(`${API_URL}/${apiKeyId}/token`);
    }

    create(apiKey: ApiKey) {
        return this.http.post<ApiKey>(`${API_URL}`, {
            name: apiKey.name,
            description: apiKey.description,
            expirationDate: apiKey.expirationDate,
            products: apiKey.products
        });
    }

    update(apiKey: ApiKey) {
        return this.http.put<ApiKey>(`${API_URL}`, {
            id: apiKey.id,
            description: apiKey.description
        });
    }

    delete(apiKeyId: string) {
        return this.http.delete(`${API_URL}/${apiKeyId}`);
    }
}
