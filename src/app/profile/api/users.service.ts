import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from './models/users/user.intreface';

const API_URL = 'api/users';

@Injectable()
export class UsersService {
    constructor(private http: HttpClient) { }

    get() {
        return this.http.get<User>(`${API_URL}`);
    }

    update(name: string, email: string) {
        return this.http.put<User>(`${API_URL}`, { name, email, company: '' });
    }

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