import { DataSource } from '@angular/cdk/table';
import { Balance } from '../../../../api/models/balance.interface';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { BalancesService } from '../../../../api/services/balances.service';
import { catchError, finalize, distinctUntilChanged, skip } from 'rxjs/operators';
import { PagedResponse } from '../../../../api/models/paged-response.interface';

export class BalancesDataSource implements DataSource<Balance> {

    private itemsSubject = new BehaviorSubject<Balance[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private paginatorTotalSubject = new BehaviorSubject<number>(0);
    private subscriptions: Subscription[] = [];

    constructor(private balancesService: BalancesService) {
        const hasItemsSubscription = this.paginatorTotal$.pipe(
            distinctUntilChanged(),
            skip(1)
        ).subscribe(res => this.hasItems = res > 0);
        this.subscriptions.push(hasItemsSubscription);
    }

    hasItems = true;
    paginatorTotal$ = this.paginatorTotalSubject.asObservable();
    loading$ = this.loadingSubject.asObservable();

    connect(collectionViewer: CollectionViewer): Observable<Balance[]> {
        return this.itemsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.itemsSubject.complete();
        this.loadingSubject.complete();
        this.paginatorTotalSubject.complete();
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    load(filter = '', sortField = '', sortDirection = 'asc', pageIndex = 0, pageSize = 3) {

        this.loadingSubject.next(true);

        this.balancesService.get(filter, sortField, sortDirection, pageIndex, pageSize)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<Balance>) => {
                this.paginatorTotalSubject.next(response.total);
                this.itemsSubject.next(response.items)
            });
    }
}