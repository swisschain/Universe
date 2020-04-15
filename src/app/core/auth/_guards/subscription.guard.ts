// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// RxJS
import { Observable, of } from 'rxjs';

import * as jwt_decode from "jwt-decode";

import { environment } from '../../../../environments/environment';

@Injectable()
export class SubscriptionGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        const token = localStorage.getItem(environment.authTokenKey);

        if (token) {

            const data = jwt_decode(token);

            const subscriptionId = data[environment.tenantIdJwtClaim];

            if (subscriptionId) {
                return of(true);
            }
        }

        this.router.navigateByUrl('/profile/subscriptions');
    }
}
