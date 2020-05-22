import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { getWalletTypeTitle } from '../../shared/utils'

import { Account } from '../../api/models/accounts';
import { Wallet, WalletType } from '../../api/models/wallets';
import { AccountService, WalletService } from '../../api/services';

@Component({
  selector: 'kt-wallet-details',
  templateUrl: './wallet-details.component.html',
  styleUrls: ['./wallet-details.component.scss']
})
export class WalletDetailsComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private walletService: WalletService) { }

  private accountId: number;
  private walletId: number;
  private subscriptions: Subscription[] = [];

  account: Account;
  wallet: Wallet;

  ngOnInit() {
    const routeSubscription = this.route.params
      .subscribe(params => {
        this.accountId = params['accountId'];
        this.walletId = params['walletId'];
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

    this.walletService.getById(this.walletId)
      .subscribe(wallet => {
        this.wallet = wallet;
      });
  }

  getWalletTypeTitle(walletType: WalletType) {
    return getWalletTypeTitle(walletType);
  }
}
