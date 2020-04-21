import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { Asset } from '../../api/models/assets/asset.interface';
import { BrokerAccountService } from '../../api/broker-account.service';
import { AssetsService } from '../../api/assets.service';
import { BrokerAccountRequisitesDataSource } from '../../models/broker-account-requisites-data-source';
import { BlockchainsService } from '../../api/blockchains.service';
import { Blockchain } from '../../api/models/blockchains/blockchain.interface';
import { RequisitesDialogComponent } from '../../shared/requisites/requisites.dialog.component';
import { BrokerAccountRequisite } from '../../api/models/brocker-account/broker-account-requisite.interface';

@Component({
  selector: 'kt-broker-account-requisites',
  templateUrl: './broker-account-requisites.component.html',
  styleUrls: ['./broker-account-requisites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrokerAccountRequisitesComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private assetsService: AssetsService,
    private blockchainsService: BlockchainsService,
    private brokerAccountService: BrokerAccountService) { }

  private brokerAccountId: number;
  private subscriptions: Subscription[] = [];
  private blockchainId = '';

  assetId = '';
  assets: Asset[];
  blockchains: Blockchain[];
  dataSource: BrokerAccountRequisitesDataSource;
  displayedColumns = ['blockchainName', 'address', 'actions'];

  ngOnInit() {
    this.dataSource = new BrokerAccountRequisitesDataSource(this.brokerAccountService);

    const routeSubscription = this.route.params.subscribe(params => {
      this.brokerAccountId = params['brokerAccountId'];
      this.load();
    });

    this.subscriptions.push(routeSubscription);

    this.loadAssets();
    this.loadBlockchains();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load(this.brokerAccountId, this.blockchainId);
  }

  loadAssets() {
    this.assetsService.getAll()
      .subscribe(response => {
        this.assets = response.items;
      });
  }

  loadBlockchains() {
    this.blockchainsService.get()
      .subscribe(result => {
        this.blockchains = result.items;
        this.cdr.markForCheck();
      });
  }

  onAssetChanged() {
    if (this.assetId) {
      const id = Number(this.assetId);
      const asset = this.assets.filter(asset => asset.assetId === id)[0]
      this.blockchainId = asset.blockchainId;
    }
    else {
      this.blockchainId = '';
    }

    this.load();
  }

  getBlockchainName(blockchainId: string) {
    if (this.blockchains) {
      const blockchain = this.blockchains.filter((blockchain) => blockchain.blockchainId === blockchainId)[0];

      return blockchain ? blockchain.name : 'unknown';
    }

    return '';
  }

  formatAddress(address: string) {
    if (address && address.length > 15)
      return address.substr(0, 6) + '...' + address.substr(address.length - 6, address.length);
    return address;
  }

  details(brokerAccountRequisite: BrokerAccountRequisite) {
    const blockchain = this.blockchains.filter((blockchain) => blockchain.blockchainId === brokerAccountRequisite.blockchainId)[0];
    this.dialog.open(RequisitesDialogComponent, {
      data: {
        address: brokerAccountRequisite.address,
        blockchain
      }, width: '600px'
    });
  }
}
