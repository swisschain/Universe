import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap, skip, delay, take, catchError, finalize } from 'rxjs/operators';
import { fromEvent, merge, Subscription, of } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { BrokerAccountService } from '../../api/broker-account.service';
import { BrokerAccountsDataSource } from '../../models/broker-accounts-data-source';
import { BrokerAccountEditDialogComponent } from '../broker-account-edit/broker-account-edit.dialog.component';

@Component({
  selector: 'kt-broker-account-list',
  templateUrl: './broker-account-list.component.html',
  styleUrls: ['./broker-account-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrokerAccountListComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private brokerAccountService: BrokerAccountService) { }

  dataSource: BrokerAccountsDataSource;
  displayedColumns = ['name', 'id', 'blockchains', 'accounts', 'state', 'created', 'activated', 'actions'];

  ngOnInit() {
    this.dataSource = new BrokerAccountsDataSource(this.brokerAccountService);
    this.load();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  load() {
    this.dataSource.load();
  }

  add(){
    const saveMessage = 'Brocker account added';
    
		const messageType = MessageType.Create;
		const dialogRef = this.dialog.open(BrokerAccountEditDialogComponent, { data: { } });
    
    dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(saveMessage, messageType, 1000, true, false);
			this.load();
		});
  }
}
