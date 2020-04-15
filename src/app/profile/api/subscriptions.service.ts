import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import * as jwt_decode from "jwt-decode";

import { environment } from '../../../environments/environment';

import { Subscription } from './models/subscriptions/subscription.interface';
import { Participant } from './models/subscriptions/participant.interface';

const API_URL = 'api/subscriptions';

@Injectable()
export class SubscriptionsService {
    constructor(private http: HttpClient) { }

    get() {
        return this.http.get<Subscription[]>(`${API_URL}`);
    }

    getById(subscriptionId: string) {
        return this.http.get<Subscription>(`${API_URL}/${subscriptionId}`);
    }

    getParticipants(subscriptionId: string) {
        return this.http.get<Participant[]>(`${API_URL}/${subscriptionId}/participants`);
    }

    add(name: string, description: string) {
        return this.http.post(`${API_URL}`, {
            name,
            description
        });
    }

    addParticipant(subscriptionId: string, email: string) {
        const params = new HttpParams()
            .set('email', email);

        return this.http.post(`${API_URL}/${subscriptionId}/participants`, {}, { params: params });
    }

    update(subscriptionId: string, name: string, description: string) {
        return this.http.put(`${API_URL}`, {
            id: subscriptionId,
            name,
            description
        });
    }

    delete(subscriptionId: string) {
        return this.http.delete(`${API_URL}/${subscriptionId}`);
    }

    deleteParticipant(subscriptionId: string, userId: string) {
        return this.http.delete(`${API_URL}/${subscriptionId}/participants/${userId}`);
    }

    getCurrentSubscriptionId() {
        const token = localStorage.getItem(environment.authTokenKey);
        const data = jwt_decode(token);
        return data[environment.tenantIdJwtClaim];
    }
}