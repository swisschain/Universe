import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { BrokerAccount } from '../../api/models/brocker-account/broker-account.interface';
import { BrokerAccountService } from '../../api/broker-account.service';

@Component({
  selector: 'kt-broker-account-details',
  templateUrl: './broker-account-details.component.html',
  styleUrls: ['./broker-account-details.component.scss']
})
export class BrokerAccountDetailsComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private brokerAccountsService: BrokerAccountService) { }

  private brokerAccountId: number;
  private subscriptions: Subscription[] = [];

  brokerAccount: BrokerAccount;

  ngOnInit() {
    const routeSub = this.route.params.subscribe(params => {
      this.brokerAccountId = params['brokerAccountId'];
      this.load();
    });

    this.subscriptions.push(routeSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  load() {
    this.brokerAccountsService.getById(this.brokerAccountId)
      .subscribe(brokerAccount => {
        this.brokerAccount = brokerAccount;
      });
  }
}
