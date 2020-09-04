import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { fromEvent, Subscription } from 'rxjs';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { BrokerAccount } from '../../api/models/brocker-accounts';
import { AccountService, BrokerAccountService } from '../../api/services';

import { AccountsDataSource } from '../../data-sources';

import { AccountEditDialogComponent } from '../account-edit/account-edit.dialog.component';

@Component({
  selector: 'kt-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountListComponent implements OnInit, OnDestroy {

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  private subscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private accountService: AccountService,
    private brokerAccountService: BrokerAccountService) { }

  hasError = false;
  dataSource: AccountsDataSource;
  displayedColumns = ['accountId', 'referenceId', 'brokerAccountId', 'state', 'createdAt', 'updatedAt', 'actions'];

  reference = '';
  brokerAccountId: number = null;
  brokerAccounts: BrokerAccount[];

  ngOnInit() {

    const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (this.hasError) {
          return;
        }
        this.reference = value;
        this.load();
      });
    this.subscriptions.push(searchSubscription);

    this.dataSource = new AccountsDataSource(this.accountService);

    this.brokerAccountService.get()
      .subscribe(response => {
        this.brokerAccounts = response.items;
        this.load();
      }, error => {
        this.hasError = true;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  load() {
    this.dataSource.load(this.brokerAccountId, this.reference);
  }

  getBrokerName(brokerAccountId: number) {
    const brokerAccount = this.brokerAccounts.filter((item) => item.id == brokerAccountId)[0];
    return brokerAccount ? brokerAccount.name : 'unknown';
  }

  add() {
    const saveMessage = 'Account added';

    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(AccountEditDialogComponent, { data: {}, width: '400px' });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(saveMessage, messageType, 1000, true, false);
      this.load();
    });
  }
}
