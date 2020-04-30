import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Account } from '../../api/models/accounts';
import { BrokerAccount } from '../../api/models/brocker-accounts';

import { AccountService, BrokerAccountService } from '../../api/services';

@Component({
  selector: 'kt-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private accountsService: AccountService,
    private brokerAccountsService: BrokerAccountService) { }

  private accountId: number;
  private subscriptions: Subscription[] = [];

  account: Account;
  brokerAccount: BrokerAccount;

  ngOnInit() {
    const routeSub = this.route.params.subscribe(params => {
      this.accountId = params['accountId'];
      this.load();
    });

    this.subscriptions.push(routeSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.accountsService.getById(this.accountId)
      .subscribe(account => {
        this.account = account;
        this.loadBrokerAccount();
      });
  }

  loadBrokerAccount() {
    this.brokerAccountsService.getById(this.account.brokerAccountId)
      .subscribe(brokerAccount => {
        this.brokerAccount = brokerAccount;
      });
  }
}
