import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class TenantHeaderInterceptor implements HttpInterceptor {

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        const tenantId = localStorage.getItem(environment.tetantIdTokenKey);

        if (tenantId) {
            const requestWithTenantId = request.clone({
                headers: request.headers.set('Tenant-Id', tenantId)
            });
            return next.handle(requestWithTenantId);
        }

        return next.handle(request);
    }
}
