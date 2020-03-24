import { DataSource } from '@angular/cdk/table';
import { Asset } from '../../../../api/models/asset.interface';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { AssetsService } from '../../../../api/services/assets.service';
import { catchError, finalize, distinctUntilChanged, skip } from 'rxjs/operators';
import { PagedResponse } from '../../../../api/models/paged-response.interface';

export class AssetsDataSource implements DataSource<Asset> {

    private itemsSubject = new BehaviorSubject<Asset[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private paginatorTotalSubject = new BehaviorSubject<number>(0);
    private subscriptions: Subscription[] = [];

    constructor(private assetsService: AssetsService) {
        const hasItemsSubscription = this.paginatorTotal$.pipe(
            distinctUntilChanged(),
            skip(1)
        ).subscribe(res => this.hasItems = res > 0);
        this.subscriptions.push(hasItemsSubscription);
    }

    hasItems = true;
    paginatorTotal$ = this.paginatorTotalSubject.asObservable();
    loading$ = this.loadingSubject.asObservable();

    connect(collectionViewer: CollectionViewer): Observable<Asset[]> {
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

        this.assetsService.get(filter, sortField, sortDirection, pageIndex, pageSize)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<Asset>) => {
                this.paginatorTotalSubject.next(response.total);
                this.itemsSubject.next(response.items)
            });
    }
}