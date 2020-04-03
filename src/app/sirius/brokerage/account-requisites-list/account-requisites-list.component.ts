import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { Asset } from '../../api/models/assets/asset.interface';
import { AssetRequisitesDialogComponent } from '../../shared/asset-requisites/asset-requisites.dialog.component';

@Component({
  selector: 'kt-account-requisites-list',
  templateUrl: './account-requisites-list.component.html',
  styleUrls: ['./account-requisites-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountRequisitesListComponent implements OnInit, OnDestroy {

  private accountId: number;
  private subscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const routeSubscription = this.route.params.subscribe(params => {
      this.accountId = params['accountId'];
    });

    this.subscriptions.push(routeSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  onAssetSelected(asset: Asset) {
    this.dialog.open(AssetRequisitesDialogComponent, { data: { accountId: this.accountId, asset }, width: '600px' });
  }
}
