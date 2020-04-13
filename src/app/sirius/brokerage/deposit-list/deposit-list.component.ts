import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, tap, skip, delay, take, catchError, finalize, map, startWith } from 'rxjs/operators';
import { fromEvent, merge, Subscription, of } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { BrokerAccountService } from '../../api/broker-account.service';
import { AssetsService } from '../../api/assets.service';
import { BlockchainsService } from '../../api/blockchains.service';
import { DepositsDataSource } from '../../models/deposits-data-source';
import { DepositsService } from '../../api/deposits.service';
import { BrokerAccount } from '../../api/models/brocker-account/broker-account.interface';
import { Blockchain } from '../../api/models/blockchains/blockchain.interface';
import { Asset } from '../../api/models/assets/asset.interface';
import { DepositState } from '../../api/models/deposits/deposit-state.enum';
import { FormControl } from '@angular/forms';

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

  getBrokerAccountName(brokerAccountId: number) {
    if (this.brokerAccounts) {
      var brokerAccount = this.brokerAccounts.filter((brokerAccount) => brokerAccount.brokerAccountId == brokerAccountId)[0];

      return brokerAccount ? brokerAccount.name : 'unknown';
    }

    return '';
  }

  getBlockchainName(blockchainId: string) {
    if (this.blockchains) {
      var blockchain = this.blockchains.filter((blockchain) => blockchain.blockchainId == blockchainId)[0];

      return blockchain ? blockchain.name : 'unknown';
    }

    return '';
  }

  getAssetSymbol(assetId: number) {
    if (this.assets) {
      var asset = this.assets.filter((asset) => asset.assetId == assetId)[0];

      return asset ? asset.symbol : 'unknown';
    }

    return '';
  }
}
