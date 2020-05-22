import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { getVaultTypeTitle } from '../../shared/utils'

import { Vault, VaultType } from '../../api/models/vaults';
import { BrokerAccount } from '../../api/models/brocker-accounts';
import { BrokerAccountService, VaultService } from '../../api/services';

@Component({
  selector: 'kt-broker-account-details',
  templateUrl: './broker-account-details.component.html',
  styleUrls: ['./broker-account-details.component.scss']
})
export class BrokerAccountDetailsComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private brokerAccountsService: BrokerAccountService,
    private vaultService: VaultService) { }

  private brokerAccountId: number;
  private subscriptions: Subscription[] = [];

  vault: Vault;
  brokerAccount: BrokerAccount;
  viewLoading = false;

  ngOnInit() {
    const routeSub = this.route.params.subscribe(params => {
      this.brokerAccountId = params['brokerAccountId'];
      this.load();
    });

    this.subscriptions.push(routeSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.viewLoading = true;
    this.brokerAccountsService.getById(this.brokerAccountId)
      .subscribe(brokerAccount => {
        this.brokerAccount = brokerAccount;
        this.vaultService.getById(brokerAccount.vaultId)
          .subscribe(vault => {
            this.vault = vault;
            this.viewLoading = false;
          });
      });
  }

  getVaultTypeTitle(type: VaultType) {
    return getVaultTypeTitle(type);
  }
}
