import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize, distinctUntilChanged, skip } from 'rxjs/operators';

import { BrokerAccount } from '../api/models/brocker-account/broker-account.interface'
import { BrokerAccountService } from '../api/broker-account.service';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class BrokerAccountsDataSource implements DataSource<BrokerAccount> {
    
    private itemsSubject = new BehaviorSubject<BrokerAccount[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private subscriptions: Subscription[] = [];

    constructor(private brokerAccountService: BrokerAccountService) {
        const hasItemsSubscription = this.itemsSubject.asObservable().pipe(
            distinctUntilChanged(),
            skip(1)
        ).subscribe(result => this.hasItems = result && result.length > 0);
        this.subscriptions.push(hasItemsSubscription);
    }

    hasItems = true;
    loading$ = this.loadingSubject.asObservable();

    connect(collectionViewer: CollectionViewer): Observable<BrokerAccount[]> {
        return this.itemsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.itemsSubject.complete();
        this.loadingSubject.complete();
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    load() {
        this.loadingSubject.next(true);

        this.brokerAccountService.get()
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<BrokerAccount>) => {
                this.itemsSubject.next(response.items)
            });
    }
}