import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Account } from '../../api/models/accounts';
import { AccountService } from '../../api/services';

@Component({
  selector: 'kt-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService) { }

  private accountId: string;
  private subscriptions: Subscription[] = [];

  account: Account;

  ngOnInit() {
    const routeSubscription = this.route.params.subscribe(params => {
      this.accountId = params['accountId'];
      this.load();
    });

    this.subscriptions.push(routeSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.accountService.getById(this.accountId)
      .subscribe(account => {
        this.account = account;
      });
  }
}
