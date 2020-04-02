import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiUrlInterceptor implements HttpInterceptor {

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        let apiUrl: string = null;

        const path = request.url.split('/')[0];

        switch (path) {
            case 'home':
                apiUrl = environment.apiUrl;
                break;
            case 'sirius':
                apiUrl = environment.siriusApiUrl;
                break;
            case 'exchange':
                apiUrl = environment.exchangeApiUrl;
                break;
        }

        const apiRequest = request.clone({ url: `${apiUrl}/${request.url.slice(path.length + 1)}` });
        return next.handle(apiRequest);
    }
}
