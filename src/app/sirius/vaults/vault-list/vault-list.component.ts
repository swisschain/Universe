import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { getVaultTypeTitle, getVaultStatusTitle } from '../../shared/utils';

import { VaultType, VaultStatus } from '../../api/models/vaults';
import { VaultService } from '../../api/services';
import { VaultDataSource } from '../../data-sources';
import { VaultEditDialogComponent } from '../vault-edit/vault-edit.dialog.component';


@Component({
  selector: 'kt-vault-list',
  templateUrl: './vault-list.component.html',
  styleUrls: ['./vault-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VaultListComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private layoutUtilsService: LayoutUtilsService,
    private vaultService: VaultService) { }

  private subscriptions: Subscription[] = [];

  searchByNameInput = new FormControl();

  hasError = false;
  dataSource: VaultDataSource;
  displayedColumns = ['vaultId', 'name', 'type', 'status', 'createdAt', 'updatedAt', 'actions'];

  types = [VaultType.Private, VaultType.Shared];

  name = '';
  type: VaultType = null;

  ngOnInit() {
    this.dataSource = new VaultDataSource(this.vaultService);

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

    this.route.queryParams.subscribe(params => {
      if (params.action === 'new') {
        this.add();
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    if (this.hasError) {
      return;
    }
    this.dataSource.load(this.name, this.type);
  }

  getVaultTypeTitle(type: VaultType) {
    return getVaultTypeTitle(type);
  }

  getVaultStatusTitle(status: VaultStatus) {
    return getVaultStatusTitle(status);
  }

  add() {
    this.edit(null);
  }

  edit(vaultId: number) {
    const saveMessage = vaultId ? 'Vault updated' : 'Vault added';
    const messageType = vaultId ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(VaultEditDialogComponent, { data: { vaultId }, width: '400px' });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.layoutUtilsService.showActionNotification(saveMessage, messageType, 1000, true, false);
      this.load();
    });
  }

  canEditApiKeys(vaultType: VaultType) {
    return vaultType === VaultType.Private;
  }
}
