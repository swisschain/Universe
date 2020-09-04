import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { distinctUntilChanged, skip } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

export class BaseDataSource<T> implements DataSource<T> {

    constructor() {
        const hasItemsSubscription = this.itemsSubject.asObservable().pipe(
            distinctUntilChanged(),
            skip(1)
        ).subscribe(result => this.hasItems = result && result.length > 0);
        this.subscriptions.push(hasItemsSubscription);

        const errorSubscription = this.errorSubject.asObservable().pipe(
            distinctUntilChanged(),
            skip(1)
        ).subscribe(vault => this.hasError = vault);
        this.subscriptions.push(errorSubscription);
    }

    protected itemsSubject = new BehaviorSubject<T[]>([]);
    protected errorSubject = new BehaviorSubject<boolean>(false);
    protected loadingSubject = new BehaviorSubject<boolean>(false);
    protected subscriptions: Subscription[] = [];

    hasError = false;
    hasItems = true;
    loading$ = this.loadingSubject.asObservable();
    isPreloadTextViewed$ = this.loadingSubject.asObservable();

    connect(collectionViewer: CollectionViewer): Observable<T[]> {
        return this.itemsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.itemsSubject.complete();
        this.loadingSubject.complete();
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    protected loading(): void {
        this.errorSubject.next(false);
        this.loadingSubject.next(true);
    }

    protected loaded(): void {
        this.loadingSubject.next(false);
    }

    protected onError(error: HttpErrorResponse): void {
        this.errorSubject.next(true);
    }
}
