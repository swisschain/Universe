import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { Asset } from '../../api/models/assets';
import { Blockchain } from '../../api/models/blockchains';
import { BrokerAccount } from '../../api/models/brocker-accounts';
import { DepositState } from '../../api/models/deposits';

import { AssetsService, BrokerAccountService, BlockchainsService, DepositsService } from '../../api/services';

import { DepositsDataSource } from '../../data-sources';

@Component({
  selector: 'kt-deposit-list',
  templateUrl: './deposit-list.component.html',
  styleUrls: ['./deposit-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepositListComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private assetsService: AssetsService,
    private depositsService: DepositsService,
    private blockchainsService: BlockchainsService,
    private brokerAccountService: BrokerAccountService) { }

  private subscriptions: Subscription[] = [];

  searchByAccountIdInput = new FormControl();
  searchByReferenceIdInput = new FormControl();

  selectedBrokerAccountId = '';
  selectedBlockchainId = '';
  selectedAssetId = '';
  selectedStates: DepositState[] = [];
  selectedAccountId: number = null;
  selectedReferenceId = '';

  brokerAccounts: BrokerAccount[];
  blockchains: Blockchain[];
  assets: Asset[];
  filteredAssets: Asset[];
  states = [DepositState.Detected, DepositState.Confirmed, DepositState.Completed, DepositState.Cancelled, DepositState.Failed];

  dataSource: DepositsDataSource;
  displayedColumns = ['state', 'brokerAccountName', 'accountId', 'referenceId', 'blockchainName', 'assetSymbol', 'amount', 'actions'];

  ngOnInit() {
    this.dataSource = new DepositsDataSource(this.depositsService);

    const searchByIdSubscription = this.searchByAccountIdInput.valueChanges
      .pipe(
        map(value => isNaN(+value) ? '' : value),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.selectedAccountId = Number(value);
        this.load();
      });

    this.subscriptions.push(searchByIdSubscription);

    const searchByReferenceIdInput = this.searchByReferenceIdInput.valueChanges
      .pipe(
        map(value => isNaN(+value) ? '' : value),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.selectedReferenceId = value;
        this.load();
      });

    this.subscriptions.push(searchByReferenceIdInput);

    this.load();
    this.loadBrokerAccounts();
    this.loadBlockchains();
    this.loadAssets();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }

  load() {
    this.dataSource.load(
      this.selectedBrokerAccountId && this.selectedBrokerAccountId !== '' ? Number(this.selectedBrokerAccountId) : null,
      this.selectedAccountId,
      this.selectedReferenceId,
      this.selectedBlockchainId,
      this.selectedAssetId && this.selectedAssetId !== '' ? Number(this.selectedAssetId) : null,
      this.selectedStates);
  }

  loadBrokerAccounts() {
    this.brokerAccountService.get()
      .subscribe(result => {
        this.brokerAccounts = result.items;
      });
  }

  loadBlockchains() {
    this.blockchainsService.get()
      .subscribe(result => {
        this.blockchains = result.items;
      });
  }

  loadAssets() {
    this.assetsService.getAll()
      .subscribe(result => {
        this.assets = result.items;
      });
  }

  onBlockchainChanged() {
    this.selectedAssetId = '';
    this.filteredAssets = this.assets.filter(asset => asset.blockchainId === this.selectedBlockchainId);
    this.load();
  }

  getBrokerAccountName(brokerAccountId: number) {
    if (this.brokerAccounts) {
      var brokerAccount = this.brokerAccounts.filter((brokerAccount) => brokerAccount.id == brokerAccountId)[0];

      return brokerAccount ? brokerAccount.name : 'unknown';
    }

    return '';
  }

  getBlockchainName(blockchainId: string) {
    if (this.blockchains) {
      var blockchain = this.blockchains.filter((blockchain) => blockchain.id == blockchainId)[0];

      return blockchain ? blockchain.name : 'unknown';
    }

    return '';
  }

  getAssetSymbol(assetId: number) {
    if (this.assets) {
      var asset = this.assets.filter((asset) => asset.id == assetId)[0];

      return asset ? asset.symbol : 'unknown';
    }

    return '';
  }
}
