import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize, distinctUntilChanged, skip } from 'rxjs/operators';

import { Deposit } from '../api/models/deposits/deposit.interface';
import { DepositState } from '../api/models/deposits/deposit-state.enum';
import { DepositsService } from '../api/deposits.service';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class DepositsDataSource implements DataSource<Deposit> {

    private itemsSubject = new BehaviorSubject<Deposit[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private subscriptions: Subscription[] = [];

    constructor(private depositsService: DepositsService) {
        const hasItemsSubscription = this.itemsSubject.asObservable().pipe(
            distinctUntilChanged(),
            skip(1)
        ).subscribe(result => this.hasItems = result && result.length > 0);
        this.subscriptions.push(hasItemsSubscription);
    }

    hasItems = true;
    loading$ = this.loadingSubject.asObservable();

    connect(collectionViewer: CollectionViewer): Observable<Deposit[]> {
        return this.itemsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.itemsSubject.complete();
        this.loadingSubject.complete();
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    load(brokerAccountId: number, accountId: number, referenceId: string, blockchainId: string, assetId: number, states: DepositState[]) {
        this.loadingSubject.next(true);

        this.depositsService.get(brokerAccountId, accountId, referenceId, blockchainId, assetId, states)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<Deposit>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
