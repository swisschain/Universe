import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize, distinctUntilChanged, skip } from 'rxjs/operators';

import { Order } from '../api/models/orders/order.interface'
import { AccountDataService } from '../api/account-data.service';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class AccountOrdersDataSource implements DataSource<Order> {

    private itemsSubject = new BehaviorSubject<Order[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private subscriptions: Subscription[] = [];

    constructor(private accountDataService: AccountDataService) {
        const hasItemsSubscription = this.itemsSubject.asObservable().pipe(
            distinctUntilChanged(),
            skip(1)
        ).subscribe(result => this.hasItems = result && result.length > 0);
        this.subscriptions.push(hasItemsSubscription);
    }

    hasItems = true;
    loading$ = this.loadingSubject.asObservable();
    isPreloadTextViewed$ = this.loadingSubject.asObservable();

    connect(collectionViewer: CollectionViewer): Observable<Order[]> {
        return this.itemsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.itemsSubject.complete();
        this.loadingSubject.complete();
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    load(walletId: string, assetPair: string, orderType: string, side: string, status: string) {
        this.loadingSubject.next(true);
        this.accountDataService.getOrders(walletId, assetPair, orderType, side, status)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<Order>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
