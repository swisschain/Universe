import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        const authToken = localStorage.getItem(environment.authTokenKey);

        let requestWithAuthToken = request;

        if (authToken) {
            requestWithAuthToken = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${authToken}`)
            });
        }

        return next.handle(requestWithAuthToken)
            .pipe(tap(() => { },
                (error: any) => {
                    if (error instanceof HttpErrorResponse) {
                        if (error.status !== 401) {
                            return;
                        }

                        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
                    }
                }));
    }
}
