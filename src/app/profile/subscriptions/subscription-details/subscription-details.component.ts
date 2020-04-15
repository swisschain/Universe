import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { SubscriptionsService } from '../../api/subscriptions.service';
import { Subscription as UserSubscription } from '../../api/models/subscriptions/subscription.interface'

@Component({
  selector: 'kt-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.scss']
})
export class SubscriptionDetailsComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private subscriptionsService: SubscriptionsService) { }

  private subscriptionId: string;
  private subscriptions: Subscription[] = [];

  subscription: UserSubscription;

  ngOnInit() {
    const routeSubscription = this.route.params.subscribe(params => {
      this.subscriptionId = params['subscriptionId'];
      this.load();
    });

    this.subscriptions.push(routeSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.subscriptionsService.getById(this.subscriptionId)
      .subscribe(subscription => {
        this.subscription = subscription;
      });
  }
}
