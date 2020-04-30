import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';

import { getProductName } from '../../shared/utils';

import { Product } from '../../api/models/api-keys';
import { ApiKeyService } from '../../api/services';
import { ApiKeyDataSource } from '../../data-sources/api-key-data-source';

@Component({
  selector: 'kt-api-key-deleted-list',
  templateUrl: './api-key-deleted-list.component.html',
  styleUrls: ['./api-key-deleted-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiKeyDeletedListComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private apiKeyService: ApiKeyService) { }

  private subscriptions: Subscription[] = [];

  searchByNameInput = new FormControl();

  dataSource: ApiKeyDataSource;
  displayedColumns = ['apiKeyId', 'name', 'expirationDate', 'products', 'created'];

  products = [Product.Exchange, Product.Sirius];

  name = '';
  product: Product = null;

  ngOnInit() {
    this.dataSource = new ApiKeyDataSource(this.apiKeyService);

    const searchByNameSubscription = this.searchByNameInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.name = value;
        this.load();
      });

    this.subscriptions.push(searchByNameSubscription);
  }

  ngAfterViewInit() {
    this.load();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load(this.name, true, this.product);
  }

  getProductName(product: Product) {
    return getProductName(product);
  }
}
