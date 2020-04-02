import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize, distinctUntilChanged, skip } from 'rxjs/operators';

import { AssetPair } from '../api/models/asset-pairs/asset-pair.interface'
import { AssetPairsService } from '../api/asset-pairs.service';
import { PagedResponse } from '../api/models/pagination/paged-response.interface';

export class AssetPairsDataSource implements DataSource<AssetPair> {

    private itemsSubject = new BehaviorSubject<AssetPair[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private subscriptions: Subscription[] = [];

    constructor(private assetsService: AssetPairsService) {
        const hasItemsSubscription = this.itemsSubject.asObservable().pipe(
            distinctUntilChanged(),
            skip(1)
        ).subscribe(result => this.hasItems = result && result.length > 0);
        this.subscriptions.push(hasItemsSubscription);
    }

    hasItems = true;
    loading$ = this.loadingSubject.asObservable();

    connect(collectionViewer: CollectionViewer): Observable<AssetPair[]> {
        return this.itemsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.itemsSubject.complete();
        this.loadingSubject.complete();
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    load(assetPairId: string, baseAssetId: string, quotingAssetId: string, isEnabled: boolean) {
        this.loadingSubject.next(true);
        this.assetsService.get(assetPairId, baseAssetId, quotingAssetId, isEnabled)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<AssetPair>) => {
                this.itemsSubject.next(response.items)
            });
    }
}