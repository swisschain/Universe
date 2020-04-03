import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize, distinctUntilChanged, skip } from 'rxjs/operators';

import { Account } from '../api/models/account/account.interface'
import { AccountService } from '../api/account.service';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class AccountsDataSource implements DataSource<Account> {

    private itemsSubject = new BehaviorSubject<Account[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private subscriptions: Subscription[] = [];

    constructor(private accountService: AccountService) {
        const hasItemsSubscription = this.itemsSubject.asObservable().pipe(
            distinctUntilChanged(),
            skip(1)
        ).subscribe(result => this.hasItems = result && result.length > 0);
        this.subscriptions.push(hasItemsSubscription);
    }

    hasItems = true;
    loading$ = this.loadingSubject.asObservable();

    connect(collectionViewer: CollectionViewer): Observable<Account[]> {
        return this.itemsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.itemsSubject.complete();
        this.loadingSubject.complete();
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    load(brokerAccountId: number, referenceId: string) {
        this.loadingSubject.next(true);

        this.accountService.get(brokerAccountId, referenceId)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<Account>) => {
                this.itemsSubject.next(response.items)
            });
    }
}