import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize, distinctUntilChanged, skip } from 'rxjs/operators';

import { Asset } from '../api/models/assets/asset.interface'
import { AssetsService } from '../api/assets.service';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class AssetsDataSource implements DataSource<Asset> {

    private itemsSubject = new BehaviorSubject<Asset[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private subscriptions: Subscription[] = [];

    constructor(private assetsService: AssetsService) {
        const hasItemsSubscription = this.itemsSubject.asObservable().pipe(
            distinctUntilChanged(),
            skip(1)
        ).subscribe(result => this.hasItems = result && result.length > 0);
        this.subscriptions.push(hasItemsSubscription);
    }

    hasItems = true;
    loading$ = this.loadingSubject.asObservable();

    connect(collectionViewer: CollectionViewer): Observable<Asset[]> {
        return this.itemsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.itemsSubject.complete();
        this.loadingSubject.complete();
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    load(symbol: string, blockchainId: string) {
        this.loadingSubject.next(true);
        this.assetsService.get(symbol, blockchainId)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<Asset>) => {
                this.itemsSubject.next(response.items)
            });
    }
}