import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Settings } from '../models/fees';
import { Response } from '../models/response';

const API_URL = 'exchange/api/fees/settings';

@Injectable()
export class FeeSettingsService {
    constructor(private http: HttpClient) { }

    get() {
        return this.http.get<Response<Settings>>(`${API_URL}`);
    }
}
