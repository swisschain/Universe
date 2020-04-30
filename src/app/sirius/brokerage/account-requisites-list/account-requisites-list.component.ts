import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { Subscription, ReplaySubject } from 'rxjs';

import { formatAddress } from '../../shared/address-utils';

import { Asset } from '../../api/models/assets';
import { AccountRequisite } from '../../api/models/accounts';
import { Blockchain } from '../../api/models/blockchains';
import { AssetsService, AccountService, BlockchainsService } from '../../api/services';

import { AccountRequisitesDataSource } from '../../data-sources';

import { RequisitesDialogComponent } from '../../shared/requisites/requisites.dialog.component';

@Component({
  selector: 'kt-account-requisites-list',
  templateUrl: './account-requisites-list.component.html',
  styleUrls: ['./account-requisites-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountRequisitesListComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private assetsService: AssetsService,
    private blockchainsService: BlockchainsService,
    private accountService: AccountService) { }

  private accountId: number;
  private subscriptions: Subscription[] = [];
  private blockchainId = '';

  assetFilterCtrl: FormControl = new FormControl();

  assetId = '';

  dataSource: AccountRequisitesDataSource;
  displayedColumns = ['blockchainName', 'address', 'tag', 'tagType', 'actions'];

  assets: Asset[];
  blockchains: Blockchain[];

  filteredAssets: ReplaySubject<Asset[]> = new ReplaySubject<Asset[]>(1);

  ngOnInit() {
    this.dataSource = new AccountRequisitesDataSource(this.accountService);

    const routeSubscription = this.route.params.subscribe(params => {
      this.accountId = params['accountId'];
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
    this.dataSource.load(this.accountId, this.blockchainId);
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
      const id = Number(this.assetId);
      const asset = this.assets.filter(asset => asset.id === id)[0]
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

  details(accountRequisite: AccountRequisite) {
    const blockchain = this.blockchains.filter((blockchain) => blockchain.id === accountRequisite.blockchainId)[0];
    this.dialog.open(RequisitesDialogComponent, {
      data: {
        address: accountRequisite.address,
        tag: accountRequisite.tag,
        tagType: accountRequisite.tagType,
        blockchain
      }, width: '600px'
    });
  }
}
