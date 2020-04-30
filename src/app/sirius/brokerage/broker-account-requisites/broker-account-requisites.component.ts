import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, } from '@angular/material';

import { Subscription, ReplaySubject } from 'rxjs';

import { formatAddress } from '../../shared/address-utils';

import { Asset } from '../../api/models/assets';
import { BrokerAccountRequisite } from '../../api/models/brocker-accounts';
import { Blockchain } from '../../api/models/blockchains';
import { AssetsService, BrokerAccountService, BlockchainsService } from '../../api/services';

import { BrokerAccountRequisitesDataSource } from '../../data-sources';

import { RequisitesDialogComponent } from '../../shared/requisites/requisites.dialog.component';

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

  assetFilterCtrl: FormControl = new FormControl();

  assetId = '';

  dataSource: BrokerAccountRequisitesDataSource;
  displayedColumns = ['blockchainName', 'address', 'actions'];

  assets: Asset[];
  blockchains: Blockchain[];

  filteredAssets: ReplaySubject<Asset[]> = new ReplaySubject<Asset[]>(1);

  ngOnInit() {
    this.dataSource = new BrokerAccountRequisitesDataSource(this.brokerAccountService);

    const routeSubscription = this.route.params.subscribe(params => {
      this.brokerAccountId = params['brokerAccountId'];
      this.load();
    });

    this.subscriptions.push(routeSubscription);

    const assetFilterCtrlSubscription = this.assetFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterAssets();
      });

    this.subscriptions.push(assetFilterCtrlSubscription);

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
        this.filterAssets();
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
      const assetId = Number(this.assetId);
      const asset = this.assets.filter(asset => asset.id === assetId)[0]
      this.blockchainId = asset.blockchainId;
    }
    else {
      this.blockchainId = '';
    }

    this.load();
  }

  filterAssets() {
    if (!this.assets) {
      return;
    }

    let searchValue = this.assetFilterCtrl.value;

    if (!searchValue) {
      this.filteredAssets.next(this.assets.slice());
      return;
    }

    searchValue = searchValue.toLowerCase();

    this.filteredAssets.next(
      this.assets.filter(asset => asset.symbol.toLowerCase().includes(searchValue))
    );
  }

  getBlockchainName(blockchainId: string) {
    if (this.blockchains) {
      const blockchain = this.blockchains.filter((blockchain) => blockchain.id === blockchainId)[0];

      return blockchain ? blockchain.name : 'unknown';
    }

    return '';
  }

  getAddress(address: string) {
    return formatAddress(address);
  }

  details(brokerAccountRequisite: BrokerAccountRequisite) {
    const blockchain = this.blockchains.filter(blockchain => blockchain.id === brokerAccountRequisite.blockchainId)[0];
    this.dialog.open(RequisitesDialogComponent, {
      data: {
        address: brokerAccountRequisite.address,
        blockchain
      }, width: '600px'
    });
  }
}
