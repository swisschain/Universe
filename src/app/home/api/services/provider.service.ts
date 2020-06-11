import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Provider } from '../models/notifications';

const API_URL = 'quasar/api/providers';

@Injectable()
export class ProviderService {
    constructor(private http: HttpClient) { }

    get() {
        return this.http.get<Provider[]>(`${API_URL}`);
    }
}
