import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

import { BrokerAccountService } from '../../api/services';
import { BrokerAccountBalancesDataSource } from '../../data-sources';

@Component({
  selector: 'kt-broker-account-balances',
  templateUrl: './broker-account-balances.component.html',
  styleUrls: ['./broker-account-balances.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrokerAccountBalancesComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private brokerAccountService: BrokerAccountService) { }

  private subscriptions: Subscription[] = [];
  private brokerAccountId: number;

  dataSource: BrokerAccountBalancesDataSource;
  displayedColumns = ['assetId', 'pendingBalance', 'ownedBalance', 'availableBalance', 'reservedBalance', 'createdAt', 'updatedAt'];

  ngOnInit() {
    this.dataSource = new BrokerAccountBalancesDataSource(this.brokerAccountService);

    const routeSub = this.route.params.subscribe(params => {
      this.brokerAccountId = params.brokerAccountId;
      this.load();
    });

    this.subscriptions.push(routeSub);

    this.load();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load(this.brokerAccountId);
  }
}
