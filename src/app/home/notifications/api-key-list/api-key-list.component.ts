import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';

import { Subscription } from 'rxjs';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { getProductTitle, getChannelTitle } from '../enum-name.util';

import { NotificationApiKey, Product, Channel, Provider } from '../../api/models/notifications';
import { NotificationApiKeyService, ProviderService } from '../../api/services';
import { NotificationApiKeyDataSource } from '../../data-sources';
import { NotificationApiKeyEditDialogComponent } from '../api-key-edit/api-key-edit.dialog.component';

@Component({
  selector: 'kt-notification-api-key-list',
  templateUrl: './api-key-list.component.html',
  styleUrls: ['./api-key-list.component.scss']
})
export class NotificationApiKeyListComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private notificationApiKeyService: NotificationApiKeyService,
    private providerService: ProviderService) { }

  private subscriptions: Subscription[] = [];

  dataSource: NotificationApiKeyDataSource;
  displayedColumns = ['product', 'channel', 'provider', 'apiKey', 'created', 'modified', 'actions'];

  providers: Provider[] = [];

  ngOnInit() {
    this.dataSource = new NotificationApiKeyDataSource(this.notificationApiKeyService);
    this.load();

    this.providerService.get()
      .subscribe(providers => {
        this.providers = providers;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load();
  }

  getProductTitle(product: Product): string {
    return getProductTitle(product);
  }

  getChannelTitle(channel: Channel): string {
    return getChannelTitle(channel);
  }

  getProviderName(providerId: string): string {
    const provider = this.providers.filter(item => item.id === providerId)[0];
    return provider ? provider.name : '';
  }

  formatApiKey(apiKey: string): string {
    if (apiKey && apiKey.length > 15) {
      return apiKey.substr(0, 6) + '...' + apiKey.substr(apiKey.length - 6, apiKey.length);
    }
    return apiKey;
  }

  add() {
    this.edit(null);
  }

  edit(apiKey: NotificationApiKey) {
    const saveMessage = apiKey ? 'API key updated' : 'API key added';
    const messageType = apiKey ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(NotificationApiKeyEditDialogComponent, { data: { apiKey }, width: '600px' });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.layoutUtilsService.showActionNotification(saveMessage, messageType, 1000, true, false);
      this.load();
    });
  }

  delete(apiKey: NotificationApiKey) {
    const dialogRef = this.layoutUtilsService
      .deleteElement('API Key Delete', 'Are you sure to permanently delete this API kye?', 'API key is deleting...');
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.notificationApiKeyService.delete(apiKey.id)
          .subscribe(
            response => {
              this.layoutUtilsService.showActionNotification('API key has been deleted.', MessageType.Delete, 3000, true, false);
              this.load();
            },
            error => {
              this.layoutUtilsService.showActionNotification('An error occurred while deleting API key.', MessageType.Update, 3000, true, false);
            }
          );
      });
  }
}
