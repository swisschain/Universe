import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize, distinctUntilChanged, skip } from 'rxjs/operators';

import { PagedResponse } from '../api/models/pagination/paged-response.interface';
import { Withdrawal } from '../api/models/withdrawal/withdrawal.interface';
import { WithdrawalService } from '../api/withdrawal.service';
import { WithdrawalState } from '../api/models/withdrawal/withdrawal-state.enum';

export class WithdrawalDataSource implements DataSource<Withdrawal> {

    constructor(private withdrawalService: WithdrawalService) {
        const hasItemsSubscription = this.itemsSubject.asObservable().pipe(
            distinctUntilChanged(),
            skip(1)
        ).subscribe(result => this.hasItems = result && result.length > 0);
        this.subscriptions.push(hasItemsSubscription);
    }

    private itemsSubject = new BehaviorSubject<Withdrawal[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private subscriptions: Subscription[] = [];

    hasItems = true;
    loading$ = this.loadingSubject.asObservable();
    isPreloadTextViewed$ = this.loadingSubject.asObservable();

    connect(collectionViewer: CollectionViewer): Observable<Withdrawal[]> {
        return this.itemsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.itemsSubject.complete();
        this.loadingSubject.complete();
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    load(brokerAccountId: number,
        accountId: number,
        referenceId: string,
        blockchainId: string,
        assetId: number,
        states: WithdrawalState[],
        transactionId: string,
        destinationAddress: string,
        destinationTag: string) {
        this.loadingSubject.next(true);

        this.withdrawalService.get(brokerAccountId,
            accountId,
            referenceId,
            blockchainId,
            assetId,
            states,
            transactionId,
            destinationAddress,
            destinationTag)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<Withdrawal>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
