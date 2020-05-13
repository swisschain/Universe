import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';

import { getProductName } from '../../shared/utils';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { ApiKey, Product } from '../../api/models/api-keys';
import { ApiKeyService } from '../../api/services';
import { ApiKeyDataSource } from '../../data-sources/api-key-data-source';
import { ApiKeyTokenDialogComponent } from '../api-key-token/api-key-token.dialog.component';
import { ApiKeyEditDialogComponent } from '../api-key-edit/api-key-edit.dialog.component';

@Component({
  selector: 'kt-api-key-list',
  templateUrl: './api-key-list.component.html',
  styleUrls: ['./api-key-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiKeyListComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private apiKeyService: ApiKeyService) { }

  private subscriptions: Subscription[] = [];

  searchByNameInput = new FormControl();

  dataSource: ApiKeyDataSource;
  displayedColumns = ['apiKeyId', 'name', 'expirationDate', 'products', 'created', 'actions'];

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
    this.dataSource.load(this.name, false, this.product);
  }

  getProductName(product: Product) {
    return getProductName(product);
  }

  isExpired(apiKey: ApiKey) {
    return (new Date()) > new Date(apiKey.expirationDate);
  }

  add() {
    this.edit(null);
  }

  edit(apiKeyId: string) {
    const saveMessage = apiKeyId ? 'API key updated' : 'API key added';
    const messageType = apiKeyId ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(ApiKeyEditDialogComponent, { data: { apiKeyId }, width: '700px' });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.layoutUtilsService.showActionNotification(saveMessage, messageType, 1000, true, false);
      this.load();
    });
  }

  token(apiKeyId: string) {
    this.dialog.open(ApiKeyTokenDialogComponent, { data: { apiKeyId }, width: '700px' });
  }

  delete(apiKeyId: string) {
    const dialogRef = this.layoutUtilsService.deleteElement('API Key Revoke', 'Are you sure to revoke this API key?', 'API key is revoking...');
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        this.apiKeyService.delete(apiKeyId)
          .subscribe(
            response => {
              this.layoutUtilsService.showActionNotification('API key has been revoked.', MessageType.Delete, 3000, true, false);
              this.load();
            },
            error => {
              this.layoutUtilsService.showActionNotification('An error occurred while revoking API key.', MessageType.Update, 3000, true, false);
            }
          );
      });
  }
}
