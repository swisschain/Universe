import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize, distinctUntilChanged, skip } from 'rxjs/operators';

import { Balance } from '../api/models/balances/balance.interface'
import { AccountDataService } from '../api/account-data.service';

export class BalancesDataSource implements DataSource<Balance> {

    constructor(private accountDataService: AccountDataService) {
        const hasItemsSubscription = this.itemsSubject.asObservable().pipe(
            distinctUntilChanged(),
            skip(1)
        ).subscribe(result => this.hasItems = result && result.length > 0);
        this.subscriptions.push(hasItemsSubscription);
    }

    private itemsSubject = new BehaviorSubject<Balance[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private subscriptions: Subscription[] = [];

    hasItems = true;
    loading$ = this.loadingSubject.asObservable();
    isPreloadTextViewed$ = this.loadingSubject.asObservable();

    connect(collectionViewer: CollectionViewer): Observable<Balance[]> {
        return this.itemsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.itemsSubject.complete();
        this.loadingSubject.complete();
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    load(walletId: string) {
        this.loadingSubject.next(true);
        this.accountDataService.getBalances(walletId)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: Balance[]) => {
                this.itemsSubject.next(response)
            });
    }
}
