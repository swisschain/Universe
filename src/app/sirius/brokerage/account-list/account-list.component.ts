import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap, skip, delay, take, catchError, finalize, map } from 'rxjs/operators';
import { fromEvent, merge, Subscription, of } from 'rxjs';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { AccountsDataSource } from '../../models/accounts-data-source';
import { AccountService } from '../../api/account.service';
import { BrokerAccount } from '../../api/models/brocker-account/broker-account.interface';
import { BrokerAccountService } from '../../api/broker-account.service';
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
    private layoutUtilsService: LayoutUtilsService,
    private accountService: AccountService,
    private brokerAccountService: BrokerAccountService) { }

  dataSource: AccountsDataSource;
  displayedColumns = ['accountId', 'referenceId', 'brokerAccountId', 'state', 'created', 'activated', 'actions'];

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
        this.reference = value;
        this.load();
      });
    this.subscriptions.push(searchSubscription);

    this.dataSource = new AccountsDataSource(this.accountService);

    this.brokerAccountService.get()
      .subscribe(response => {
        this.brokerAccounts = response.items;
        this.load();
      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  load() {
    this.dataSource.load(this.brokerAccountId, this.reference);
  }

  getBrokerName(brokerAccountId: number) {
    var brokerAccount = this.brokerAccounts.filter((brokerAccount) => brokerAccount.brokerAccountId == brokerAccountId)[0];
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
