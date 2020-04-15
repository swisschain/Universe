import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Subscription, fromEvent } from 'rxjs';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { Account } from '../../api/models/accounts/account.interface';
import { AccountsService } from '../../api/accounts.service';
import { AccountsDataSource } from '../../models/accounts-data-source';
import { AccountEditDialogComponent } from '../account-edit/account-edit.dialog.component';

@Component({
  selector: 'kt-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountListComponent implements OnInit, OnDestroy {

  @ViewChild('searchByNameInput', { static: true }) searchByNameInput: ElementRef;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private accountsService: AccountsService) { }

  private subscriptions: Subscription[] = [];

  dataSource: AccountsDataSource;
  displayedColumns = ['accountId', 'name', 'isDisabled', 'created', 'modified', 'actions'];

  name = '';
  status = '';

  ngOnInit() {

    this.dataSource = new AccountsDataSource(this.accountsService);

    const searchByNameSubscription = fromEvent(this.searchByNameInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.name = value;
        this.load();
      });

    this.subscriptions.push(searchByNameSubscription);

    this.load();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    const status = this.status === 'enabled' ? true : this.status === 'disabled' ? false : null;
    this.dataSource.load(this.name, status);
  }

  add() {
    const account: Account = {
      id: null,
      name: null,
      brokerId: null,
      isDisabled: false,
      created: null,
      modified: null
    };

    this.edit(account);
  }

  edit(account: Account) {
    const saveMessage = account.id ? 'Account updated' : 'Account added';
    const messageType = account.id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(AccountEditDialogComponent, { data: { account }, width: '500px' });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(saveMessage, messageType, 1000, true, false);
      this.load();
    });
  }

  delete(account: Account) {
    const dialogRef = this.layoutUtilsService.deleteElement('Account Delete', 'Are you sure to permanently delete this account?', 'Account is deleting...');
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.accountsService.delete(account.id)
          .subscribe(
            response => {
              this.layoutUtilsService.showActionNotification('Account has been deleted.', MessageType.Delete, 3000, true, false);
              this.load();
            },
            error => {
              this.layoutUtilsService.showActionNotification('An error occurred while deleting account.', MessageType.Update, 3000, true, false);
            }
          );
      });
  }
}
