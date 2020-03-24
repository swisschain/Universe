import { DataSource } from '@angular/cdk/table';
import { Asset } from '../../../../api/models/asset.interface';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { OrderBooksService } from '../../../../api/services/order-books.service';
import { catchError, finalize, distinctUntilChanged, skip } from 'rxjs/operators';
import { OrderBookListItem } from '../../../../api/models/order-book-list-item.interface';

export class OrderBooksDataSource implements DataSource<OrderBookListItem> {

    private itemsSubject = new BehaviorSubject<OrderBookListItem[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private paginatorTotalSubject = new BehaviorSubject<number>(0);
    private subscriptions: Subscription[] = [];

    constructor(private orderBooksService: OrderBooksService) {
        const hasItemsSubscription = this.paginatorTotal$.pipe(
            distinctUntilChanged(),
            skip(1)
        ).subscribe(res => this.hasItems = res > 0);
        this.subscriptions.push(hasItemsSubscription);
    }

    hasItems = true;
    paginatorTotal$ = this.paginatorTotalSubject.asObservable();
    loading$ = this.loadingSubject.asObservable();

    connect(collectionViewer: CollectionViewer): Observable<OrderBookListItem[]> {
        return this.itemsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.itemsSubject.complete();
        this.loadingSubject.complete();
        this.paginatorTotalSubject.complete();
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    load() {

        this.loadingSubject.next(true);

        this.orderBooksService.get()
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: OrderBookListItem[]) => {
                this.paginatorTotalSubject.next(response.length);
                this.itemsSubject.next(response)
            });
    }
}