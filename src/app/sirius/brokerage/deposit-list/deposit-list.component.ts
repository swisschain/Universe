import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import { Subscription, forkJoin, ReplaySubject } from 'rxjs';
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
    private cdr: ChangeDetectorRef,
    private assetsService: AssetsService,
    private depositsService: DepositsService,
    private blockchainsService: BlockchainsService,
    private brokerAccountService: BrokerAccountService) { }

  private subscriptions: Subscription[] = [];

  searchByAccountIdInput = new FormControl();
  searchByReferenceIdInput = new FormControl();
  searchByBlockchainIdInput = new FormControl();
  brokerAccountFilterCtrl = new FormControl();
  assetFilterCtrl = new FormControl();

  assetSearching = false;
  brokerAccountSearching = false;

  selectedBrokerAccountId = '';
  selectedBlockchainId = '';
  selectedAssetId = '';
  selectedStates: DepositState[] = [];
  selectedAccountId: number = null;
  selectedReferenceId = '';

  blockchains: Blockchain[];
  filteredAssets: ReplaySubject<Asset[]> = new ReplaySubject<Asset[]>(1);
  filteredBrokerAccounts: ReplaySubject<BrokerAccount[]> = new ReplaySubject<BrokerAccount[]>(1);
  states = [DepositState.Detected, DepositState.Confirmed, DepositState.Completed, DepositState.Cancelled, DepositState.Failed];

  hasError = false;
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

    const blockchainIdSubscription = this.searchByBlockchainIdInput.valueChanges
      .subscribe(value => {
        this.selectedAssetId = '';
        this.filteredAssets.next([]);
        if (value) {
          this.assetsService
            .get('', value)
            .pipe(
              map(result => {
                return result.items;
              })
            )
            .subscribe(result => {
              if (!this.assetSearching) {
                this.filteredAssets.next(result);
              }
            });
        }
        this.load();
      });

    this.subscriptions.push(blockchainIdSubscription);

    const assetFilterCtrlSubscription = this.assetFilterCtrl.valueChanges
      .pipe(
        tap(() => this.assetSearching = true),
        debounceTime(500),
        switchMap(search => {
          if (!this.selectedBlockchainId) {
            return [];
          }
          return this.assetsService
            .get(search, this.selectedBlockchainId)
            .pipe(
              map(result => {
                return result.items;
              })
            );
        })
      )
      .subscribe(result => {
        this.assetSearching = false;
        this.filteredAssets.next(result);
      },
        error => {
          this.assetSearching = false;
        });

    this.subscriptions.push(assetFilterCtrlSubscription);

    const brokerAccountFilterCtrlSubscription = this.brokerAccountFilterCtrl.valueChanges
      .pipe(
        tap(() => this.brokerAccountSearching = true),
        debounceTime(500),
        switchMap(search => {
          return this.brokerAccountService
            .get(search)
            .pipe(
              map(result => {
                return result.items;
              })
            );
        })
      )
      .subscribe(result => {
        this.brokerAccountSearching = false;
        this.filteredBrokerAccounts.next(result);
      },
        error => {
          this.brokerAccountSearching = false;
        });

    this.subscriptions.push(brokerAccountFilterCtrlSubscription);

    forkJoin([
      this.brokerAccountService.get(),
      this.blockchainsService.get()
    ]).subscribe(result => {
      this.filteredBrokerAccounts.next(result[0].items);
      this.blockchains = result[1].items;
      this.load();
    }, error => {
      this.hasError = true;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    if (this.hasError) {
      return;
    }
    this.dataSource.load(
      this.selectedBrokerAccountId && this.selectedBrokerAccountId !== '' ? Number(this.selectedBrokerAccountId) : null,
      this.selectedAccountId,
      this.selectedReferenceId,
      this.selectedBlockchainId,
      this.selectedAssetId && this.selectedAssetId !== '' ? Number(this.selectedAssetId) : null,
      this.selectedStates);
  }
}
