import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { BrokerAccountService } from '../../api/broker-account.service';
import { AssetsService } from '../../api/assets.service';
import { BlockchainsService } from '../../api/blockchains.service';
import { DepositsDataSource } from '../../models/deposits-data-source';
import { DepositsService } from '../../api/deposits.service';
import { BrokerAccount } from '../../api/models/brocker-account/broker-account.interface';
import { Blockchain } from '../../api/models/blockchains/blockchain.interface';
import { Asset } from '../../api/models/assets/asset.interface';
import { Deposit } from '../../api/models/deposits/deposit.interface';
import { AccountService } from '../../api/account.service';
import { Account } from '../../api/models/account/account.interface';

@Component({
  selector: 'kt-deposit-details',
  templateUrl: './deposit-details.component.html',
  styleUrls: ['./deposit-details.component.scss']
})
export class DepositDetailsComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private assetsService: AssetsService,
    private depositsService: DepositsService,
    private blockchainsService: BlockchainsService,
    private accountService: AccountService,
    private brokerAccountService: BrokerAccountService) { }

  private subscriptions: Subscription[] = [];
  private assets: Asset[];

  displayedColumns = ['address', 'amount'];
  depositId: number;
  deposit: Deposit;
  account: Account;
  asset: Asset;
  blockchain: Blockchain;
  brokerAccount: BrokerAccount;

  ngOnInit() {
    const routeSubscription = this.route.params.subscribe(params => {
      this.depositId = params['depositId'];
      this.load();
    });
    
    this.subscriptions.push(routeSubscription);

    this.loadAssets();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.depositsService.getById(this.depositId)
      .subscribe(deposit => {
        this.deposit = deposit;
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
    this.brokerAccountService.getById(this.deposit.brokerAccountId)
      .subscribe(brokerAccount => {
        this.brokerAccount = brokerAccount;
        this.changeDetectorRef.markForCheck();
      });

    if (this.deposit.accountId) {
      this.accountService.getById(this.deposit.accountId)
        .subscribe(account => {
          this.account = account;
          this.changeDetectorRef.markForCheck();
        });
    }

    this.assetsService.getById(this.deposit.assetId)
      .subscribe(asset => {
        this.asset = asset;
        this.changeDetectorRef.markForCheck();
      });

    this.blockchainsService.getById(this.deposit.blockchainId)
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
