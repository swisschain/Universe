import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription, from } from 'rxjs';
import { FormControl } from '@angular/forms';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { getWalletTypeTitle } from '../../shared/utils'

import { WalletType } from '../../api/models/wallets';
import { WalletService } from '../../api/services';

import { WalletDataSource } from '../../data-sources';
import { WalletEditDialogComponent } from '../wallet-edit/wallet-edit.dialog.component';

@Component({
  selector: 'kt-wallet-list',
  templateUrl: './wallet-list.component.html',
  styleUrls: ['./wallet-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletListComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private layoutUtilsService: LayoutUtilsService,
    private walletService: WalletService) { }

  private accountId: number;
  private subscriptions: Subscription[] = [];

  searchByNameInput = new FormControl();

  dataSource: WalletDataSource;
  displayedColumns = ['walletId', 'name', 'type', 'isEnabled', 'modified', 'created', 'actions'];

  name = '';
  type: WalletType = null;
  status = '';

  ngOnInit() {
    this.dataSource = new WalletDataSource(this.walletService);

    const routeSubscription = this.route.params.subscribe(params => {
      this.accountId = params['accountId'];
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
    const isEnabled = this.status === 'enabled' ? true : this.status === 'disabled' ? false : null;
    this.dataSource.load(this.accountId, this.name, isEnabled, this.type);
  }

  getWalletTypeTitle(walletType: WalletType) {
    return getWalletTypeTitle(walletType);
  }

  add() {
    this.edit(null);
  }

  edit(walletId: number) {
    const saveMessage = walletId ? 'Wallet updated' : 'Wallet added';
    const messageType = walletId ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(WalletEditDialogComponent, { data: { walletId, accountId: this.accountId }, width: '500px' });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (!result) {
          return;
        }
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 1000, true, false);
        this.load();
      });
  }
}
