import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { VaultService } from '../../api/services';

@Component({
  selector: 'kt-api-key-list',
  templateUrl: './api-key-list.component.html',
  styleUrls: ['./api-key-list.component.scss']
})
export class ApiKeyListComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private vaultService: VaultService) { }

  private subscriptions: Subscription[] = [];

  vaultId: number;
  vaultName: string;

  viewLoading = false;

  ngOnInit() {
    const routeSubscription = this.route.params.subscribe(params => {
      this.vaultId = params['vaultId'];
      this.load();
    });

    this.subscriptions.push(routeSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.viewLoading = true;
    this.vaultService.getById(this.vaultId)
      .subscribe(vault => {
        this.vaultName = vault.name;
        this.viewLoading = false;
      });
  }
}
