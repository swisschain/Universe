import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'kt-account-balance-list',
  templateUrl: './account-balance-list.component.html',
  styleUrls: ['./account-balance-list.component.scss']
})
export class AccountBalanceListComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute) { }

  private accountId: string;
  private subscriptions: Subscription[] = [];

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

  load() { }
}
