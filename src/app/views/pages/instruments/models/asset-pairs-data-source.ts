import { DataSource } from '@angular/cdk/table';
import { AssetPair } from '../../../../api/models/asset-pair.interface';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { AssetPairsService } from '../../../../api/services/asset-pairs.service';
import { catchError, finalize, distinctUntilChanged, skip } from 'rxjs/operators';
import { PagedResponse } from '../../../../api/models/paged-response.interface';

export class AssetPairsDataSource implements DataSource<AssetPair> {

    private itemsSubject = new BehaviorSubject<AssetPair[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private paginatorTotalSubject = new BehaviorSubject<number>(0);
    private subscriptions: Subscription[] = [];

    constructor(private assetPairsService: AssetPairsService) {
        const hasItemsSubscription = this.paginatorTotal$.pipe(
            distinctUntilChanged(),
            skip(1)
        ).subscribe(res => this.hasItems = res > 0);
        this.subscriptions.push(hasItemsSubscription);
    }

    hasItems = true;
    paginatorTotal$ = this.paginatorTotalSubject.asObservable();
    loading$ = this.loadingSubject.asObservable();

    connect(collectionViewer: CollectionViewer): Observable<AssetPair[]> {
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

        this.assetPairsService.get(filter, sortField, sortDirection, pageIndex, pageSize)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<AssetPair>) => {
                this.paginatorTotalSubject.next(response.total);
                this.itemsSubject.next(response.items)
            });
    }
}