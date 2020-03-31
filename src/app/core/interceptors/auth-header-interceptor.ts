import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor {

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        const authToken = localStorage.getItem(environment.authTokenKey);

        if (authToken) {
            const requestWithAuthToken = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${authToken}`)
            });
            return next.handle(requestWithAuthToken);
        }

        return next.handle(request);
    }
}
