import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { KeyKeepingConfiguration } from '../models/key-keeping-configurations';

const API_URL = 'sirius/api/key-keeping-configurations';

@Injectable()
export class KeyKeepingConfigurationService {
    constructor(private http: HttpClient) { }

    get() {
        return this.http.get<KeyKeepingConfiguration>(`${API_URL}`);
    }

    update(activateApprovementsCount: number, manualTransactionApprovementsCount: number, requestId: string) {
        const headers = new HttpHeaders()
            .set('X-Request-ID', requestId);
        return this.http.put<KeyKeepingConfiguration>(`${API_URL}`, {
            activateApprovementsCount,
            manualTransactionApprovementsCount
        }, { headers: headers });
    }
}
