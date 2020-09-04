import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { getVaultTypeTitle } from '../../shared/utils';

import { Vault } from '../../api/models/vaults';
import { BrokerAccountService, VaultService } from '../../api/services';
import { BrokerAccountsDataSource } from '../../data-sources';
import { BrokerAccountEditDialogComponent } from '../broker-account-edit/broker-account-edit.dialog.component';

@Component({
  selector: 'kt-broker-account-list',
  templateUrl: './broker-account-list.component.html',
  styleUrls: ['./broker-account-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrokerAccountListComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private layoutUtilsService: LayoutUtilsService,
    private brokerAccountService: BrokerAccountService,
    private vaultService: VaultService) { }

  private vaults: Vault[] = [];

  hasError = false;
  dataSource: BrokerAccountsDataSource;
  displayedColumns = ['brokerAccountId', 'name', 'blockchainsCount', 'accountCount', 'state', 'vault', 'createdAt', 'updatedAt', 'actions'];

  ngOnInit() {
    this.dataSource = new BrokerAccountsDataSource(this.brokerAccountService);
    this.vaultService.getAll()
      .subscribe(vaults => {
        this.vaults = vaults;
        this.load();
      }, error => {
        this.hasError = true;
        this.cdr.markForCheck();
      });
  }

  load() {
    this.dataSource.load();
  }

  getVaultName(vaultId: number) {
    const vault = this.vaults.filter(o => o.id == vaultId)[0];

    if (vault) {
      return `${vault.name} (${getVaultTypeTitle(vault.type)})`;
    }

    return '';
  }

  add() {
    const saveMessage = 'Brocker account added';
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(BrokerAccountEditDialogComponent, { data: {}, width: '400px' });

    dialogRef.afterClosed()
      .subscribe(data => {
        if (data === 'create-new-vault') {
          this.router.navigate(['../../vaults'], { queryParams: {action: 'new'}, relativeTo: this.route });
        } else {
          this.layoutUtilsService.showActionNotification(saveMessage, messageType, 1000, true, false);
          this.load();
        }
      });
  }
}
