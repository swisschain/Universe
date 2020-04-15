import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

const API_URL = 'api/users';

@Injectable()
export class UsersService {
    constructor(private http: HttpClient) { }

    updateToken() {
        return this.http.post(`api/refresh`, {})
            .pipe(
                tap((response: any) => {
                    localStorage.setItem(environment.authTokenKey, response.token);
                })
            );
    }

    switchSubscription(subscriptionId: string) {
        return this.http.patch(`${API_URL}/subscriptions/${subscriptionId}`, {});
    }
}