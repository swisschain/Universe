import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { BrokerAccountService } from '../../api/broker-account.service';
import { AssetsService } from '../../api/assets.service';
import { BlockchainsService } from '../../api/blockchains.service';
import { WithdrawalService } from '../../api/withdrawal.service';
import { BrokerAccount } from '../../api/models/brocker-account/broker-account.interface';
import { Blockchain } from '../../api/models/blockchains/blockchain.interface';
import { Asset } from '../../api/models/assets/asset.interface';
import { Withdrawal } from '../../api/models/withdrawal/withdrawal.interface';
import { AccountService } from '../../api/account.service';
import { Account } from '../../api/models/account/account.interface';

@Component({
  selector: 'kt-withdrawal-details',
  templateUrl: './withdrawal-details.component.html',
  styleUrls: ['./withdrawal-details.component.scss']
})
export class WithdrawalDetailsComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private assetsService: AssetsService,
    private withdrawalService: WithdrawalService,
    private blockchainsService: BlockchainsService,
    private accountService: AccountService,
    private brokerAccountService: BrokerAccountService) { }

  private subscriptions: Subscription[] = [];
  private assets: Asset[];

  withdrawalId: number;
  withdrawal: Withdrawal;
  account: Account;
  asset: Asset;
  blockchain: Blockchain;
  brokerAccount: BrokerAccount;

  ngOnInit() {
    const routeSubscription = this.route.params.subscribe(params => {
      this.withdrawalId = params['withdrawalId'];
      this.load();
    });

    this.subscriptions.push(routeSubscription);

    this.loadAssets();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.withdrawalService.getById(this.withdrawalId)
      .subscribe(withdrawal => {
        this.withdrawal = withdrawal;
        this.loadReleted();
        this.changeDetectorRef.markForCheck()
      });
  }

  loadAssets() {
    this.assetsService.getAll()
      .subscribe(result => {
        this.assets = result.items;
      });
  }

  loadReleted() {
    this.brokerAccountService.getById(this.withdrawal.brokerAccountId)
      .subscribe(brokerAccount => {
        this.brokerAccount = brokerAccount;
        this.changeDetectorRef.markForCheck();
      });

    if (this.withdrawal.accountId) {
      this.accountService.getById(this.withdrawal.accountId)
        .subscribe(account => {
          this.account = account;
          this.changeDetectorRef.markForCheck();
        });
    }

    this.assetsService.getById(this.withdrawal.assetId)
      .subscribe(asset => {
        this.asset = asset;
        this.changeDetectorRef.markForCheck();
      });

    this.blockchainsService.getById(this.withdrawal.blockchainId)
      .subscribe(blockchain => {
        this.blockchain = blockchain;
        this.changeDetectorRef.markForCheck();
      });
  }

  getAssetSymbol(assetId: number) {
    if (this.assets) {
      var asset = this.assets.filter((asset) => asset.assetId == assetId)[0];

      return asset ? asset.symbol : 'unknown';
    }

    return '';
  }
}
