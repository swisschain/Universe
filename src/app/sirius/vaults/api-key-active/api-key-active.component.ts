import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';

import { v4 as uuidv4 } from 'uuid';

import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { ApiKey } from '../../api/models/vaults';
import { VaultService } from '../../api/services';
import { VaultApiKeyDataSource } from '../../data-sources';
import { ApiKeyEditDialogComponent } from '../api-key-edit/api-key-edit.dialog.component';
import { ApiKeyTokenDialogComponent } from '../api-key-token/api-key-token.dialog.component';

@Component({
  selector: 'kt-api-key-active',
  templateUrl: './api-key-active.component.html',
  styleUrls: ['./api-key-active.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiKeyActiveComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private layoutUtilsService: LayoutUtilsService,
    private vaultService: VaultService) { }

  private subscriptions: Subscription[] = [];
  private vaultId: number = null;

  searchByNameInput = new FormControl();

  dataSource: VaultApiKeyDataSource;
  displayedColumns = ['apiKeyId', 'name', 'expiresAt', 'issuedAt', 'actions'];

  name = '';

  ngOnInit() {
    this.dataSource = new VaultApiKeyDataSource(this.vaultService);

    const routeSubscription = this.route.params.subscribe(params => {
      this.vaultId = params['vaultId'];
      this.load();
    });
    this.subscriptions.push(routeSubscription);

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

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load(this.vaultId, this.name, false);
  }

  isExpired(apiKey: ApiKey) {
    return (new Date()) > new Date(apiKey.expiresAt);
  }

  token(apiKeyId: number) {
    this.dialog.open(ApiKeyTokenDialogComponent, { data: { vaultId: this.vaultId, apiKeyId }, width: '400px' });
  }

  add() {
    const saveMessage = 'API key added';
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(ApiKeyEditDialogComponent, { data: { vaultId: this.vaultId }, width: '400px' });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.layoutUtilsService.showActionNotification(saveMessage, messageType, 1000, true, false);
      this.load();
    });
  }

  revoke(apiKeyId: number) {
    const dialogRef = this.layoutUtilsService.deleteElement('Vault API Key Revoke', 'Are you sure to revoke this API key?', 'Vault API key revoking...');
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.vaultService.revokeApiKey(this.vaultId, apiKeyId, uuidv4())
          .subscribe(
            response => {
              this.layoutUtilsService.showActionNotification('Vault API key has been revoked.', MessageType.Delete, 3000, true, false);
              this.load();
            },
            error => {
              this.layoutUtilsService.showActionNotification('An error occurred while revoking vault API key.', MessageType.Update, 3000, true, false);
            }
          );
      });
  }
}
