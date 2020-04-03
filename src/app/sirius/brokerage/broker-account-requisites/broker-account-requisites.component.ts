import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { Asset } from '../../api/models/assets/asset.interface';
import { AssetRequisitesDialogComponent } from '../../shared/asset-requisites/asset-requisites.dialog.component';

@Component({
  selector: 'kt-broker-account-requisites',
  templateUrl: './broker-account-requisites.component.html',
  styleUrls: ['./broker-account-requisites.component.scss']
})
export class BrokerAccountRequisitesComponent implements OnInit {

  private brokerAccountId: number;
  private subscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const routeSubscription = this.route.params.subscribe(params => {
      this.brokerAccountId = params['brokerAccountId'];
    });

    this.subscriptions.push(routeSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  onAssetSelected(asset: Asset) {
    this.dialog.open(AssetRequisitesDialogComponent, { data: { brokerAccountId: this.brokerAccountId, asset }, width: '600px' });
  }

}
