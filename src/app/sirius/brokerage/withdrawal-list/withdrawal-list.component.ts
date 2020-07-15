import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Subscription, forkJoin } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { Asset } from '../../api/models/assets';
import { Blockchain } from '../../api/models/blockchains';
import { BrokerAccount } from '../../api/models/brocker-accounts';
import { WithdrawalState } from '../../api/models/withdrawals';

import { AssetsService, BlockchainsService, BrokerAccountService, WithdrawalService } from '../../api/services';

import { WithdrawalDataSource } from '../../data-sources';

import { WithdrawalEditDialogComponent } from '../withdrawal-edit/withdrawal-edit.dialog.component';

@Component({
  selector: 'kt-withdrawal-list',
  templateUrl: './withdrawal-list.component.html',
  styleUrls: ['./withdrawal-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WithdrawalListComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private withdrawalService: WithdrawalService,
    private assetsService: AssetsService,
    private blockchainsService: BlockchainsService,
    private brokerAccountService: BrokerAccountService) { }

  private subscriptions: Subscription[] = [];

  searchByAccountIdInput = new FormControl();
  searchByReferenceIdInput = new FormControl();
  searchByTransactionIdInput = new FormControl();
  searchByDestinationAddressInput = new FormControl();
  searchByDestinationTagInput = new FormControl();

  selectedBrokerAccountId = '';
  selectedAccountId: number = null;
  selectedReferenceId = '';
  selectedBlockchainId = '';
  selectedAssetId = '';
  selectedStates: WithdrawalState[] = [];
  selectedTransactionId = '';
  selectedDestinationAddress = '';
  selectedDestinationTag = '';

  brokerAccounts: BrokerAccount[];
  blockchains: Blockchain[];
  assets: Asset[];
  filteredAssets: Asset[];
  states = [WithdrawalState.Processing, WithdrawalState.Executing, WithdrawalState.Sent, WithdrawalState.Completed, WithdrawalState.Failed];

  dataSource: WithdrawalDataSource;
  displayedColumns = ['state', 'brokerAccountName', 'accountId', 'referenceId', 'blockchainName', 'assetSymbol', 'amount', 'actions'];

  ngOnInit() {
    this.dataSource = new WithdrawalDataSource(this.withdrawalService);

    const searchByAccountIdSubscription = this.searchByAccountIdInput.valueChanges
      .pipe(
        map(value => isNaN(+value) ? '' : value),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.selectedAccountId = Number(value);
        this.load();
      });

    this.subscriptions.push(searchByAccountIdSubscription);

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

    const searchByTransactionIdInput = this.searchByTransactionIdInput.valueChanges
      .pipe(
        map(value => isNaN(+value) ? '' : value),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.selectedTransactionId = value;
        this.load();
      });

    this.subscriptions.push(searchByTransactionIdInput);

    const searchByDestinationAddressInput = this.searchByDestinationAddressInput.valueChanges
      .pipe(
        map(value => isNaN(+value) ? '' : value),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.selectedDestinationAddress = value;
        this.load();
      });

    this.subscriptions.push(searchByDestinationAddressInput);

    const searchByDestinationTagInput = this.searchByDestinationTagInput.valueChanges
      .pipe(
        map(value => isNaN(+value) ? '' : value),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.selectedDestinationTag = value;
        this.load();
      });

    this.subscriptions.push(searchByDestinationTagInput);

    forkJoin([
      this.brokerAccountService.get(),
      this.blockchainsService.get(),
      this.assetsService.getAll()
    ]).subscribe(result => {
      this.brokerAccounts = result[0].items;
      this.blockchains = result[1].items;
      this.assets = result[2].items;
      this.load();
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load(
      this.selectedBrokerAccountId && this.selectedBrokerAccountId !== '' ? Number(this.selectedBrokerAccountId) : null,
      this.selectedAccountId,
      this.selectedReferenceId,
      this.selectedBlockchainId,
      this.selectedAssetId && this.selectedAssetId !== '' ? Number(this.selectedAssetId) : null,
      this.selectedStates,
      this.selectedTransactionId,
      this.selectedDestinationAddress,
      this.selectedDestinationTag);
  }

  onBlockchainChanged() {
    this.selectedAssetId = '';
    this.filteredAssets = this.assets.filter(asset => asset.blockchainId === this.selectedBlockchainId);
    this.load();
  }

  getBrokerAccountName(brokerAccountId: number) {
    if (this.brokerAccounts) {
      const brokerAccount = this.brokerAccounts.filter((item) => item.id === brokerAccountId)[0];
      return brokerAccount ? brokerAccount.name : 'unknown';
    }
    return '';
  }

  create() {
    const saveMessage = 'Withdrawal created';
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(WithdrawalEditDialogComponent, { data: {}, width: '700px' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.layoutUtilsService.showActionNotification(saveMessage, messageType, 1000, true, false);
      this.load();
    });
  }
}
