import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { TradingFee } from '../../api/models/fees';

import { AssetPairsService } from '../../api/asset-pairs.service';
import { TradingFeeService } from '../../api/services';

import { TradingFeeDataSource } from '../../data-sources';
import { TradingFeeEditDialogComponent } from '../trading-fee-edit/trading-fee-edit.dialog.component';

@Component({
  selector: 'kt-trading-fee-list',
  templateUrl: './trading-fee-list.component.html',
  styleUrls: ['./trading-fee-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradingFeeListComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private assetPairsService: AssetPairsService,
    private tradingFeeService: TradingFeeService) { }

  private subscriptions: Subscription[] = [];

  searchByAssetPairInput = new FormControl();

  assetPairs: string[] = [];
  filteredAssetPairs: Observable<string[]>;

  dataSource: TradingFeeDataSource;
  displayedColumns = ['assetPair', 'asset', 'created', 'modified', 'actions'];

  assetPair = '';

  ngOnInit() {
    this.dataSource = new TradingFeeDataSource(this.tradingFeeService);

    const searchByAssetSubscription = this.searchByAssetPairInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.assetPair = value;
        this.load();
      });
    this.subscriptions.push(searchByAssetSubscription);

    this.filteredAssetPairs = this.searchByAssetPairInput.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          const filterValue = value.toLowerCase();
          return this.assetPairs.filter(asset => asset.toLowerCase().includes(filterValue));
        })
      );

    this.load();
    this.loadAssetPairs();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load(this.assetPair);
  }

  loadAssetPairs() {
    this.assetPairsService.getAll()
      .subscribe(assetPairs => {
        this.assetPairs = assetPairs.map(item => item.symbol);
      });
  }

  add() {
    this.edit(null);
  }

  edit(tradingFeeId: string) {
    const saveMessage = tradingFeeId ? 'Trading fee updated' : 'Trading fee added';
    const messageType = tradingFeeId ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(TradingFeeEditDialogComponent, { data: { tradingFeeId }, width: '400px' });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.layoutUtilsService.showActionNotification(saveMessage, messageType, 1000, true, false);
      this.load();
    });
  }

  delete(tradingFee: TradingFee) {
    const dialogRef = this.layoutUtilsService.deleteElement('Trading Fee Delete', 'Are you sure to permanently delete this fee?', 'Trading fee is deleting...');
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.tradingFeeService.delete(tradingFee.id)
          .subscribe(
            response => {
              this.layoutUtilsService.showActionNotification('Trading fee has been deleted.', MessageType.Delete, 3000, true, false);
              this.load();
            },
            error => {
              this.layoutUtilsService.showActionNotification('An error occurred while deleting trading fee.', MessageType.Update, 3000, true, false);
            }
          );
      });
  }
}
