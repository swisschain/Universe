import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { TradingFee, TradingFeeLevel } from '../../api/models/fees';

import { TradingFeeService } from '../../api/services';

import { TradingFeeLevelDataSource } from '../../data-sources';
import { TradingFeeLevelEditDialogComponent } from '../trading-fee-level-edit/trading-fee-level-edit.dialog.component';


@Component({
  selector: 'kt-trading-fee-level-list',
  templateUrl: './trading-fee-level-list.component.html',
  styleUrls: ['./trading-fee-level-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradingFeeLevelListComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private tradingFeeService: TradingFeeService) { }

  private tradingFeeId: number;
  private subscriptions: Subscription[] = [];

  dataSource: TradingFeeLevelDataSource;
  displayedColumns = ['volume', 'makerFee', 'takerFee', 'created', 'modified', 'actions'];

  assetPair: string;
  asset: string;  

  ngOnInit() {
    this.dataSource = new TradingFeeLevelDataSource(this.tradingFeeService);

    const routeSubscription = this.route.params.subscribe(params => {
      this.tradingFeeId = params['tradingFeeId'];
      this.load();
      this.loadTradingFee();
    });

    this.subscriptions.push(routeSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load(this.tradingFeeId);
  }

  loadTradingFee() {
    this.tradingFeeService.getById(this.tradingFeeId)
      .subscribe(tradingFee => {
        this.assetPair = tradingFee.payload.assetPair;
        this.asset = tradingFee.payload.asset;
      });
  }

  add() {
    this.edit(null);
  }

  edit(tradingFeeLevel: TradingFeeLevel) {
    const saveMessage = tradingFeeLevel ? 'Trading fee level updated' : 'Trading fee level added';
    const messageType = tradingFeeLevel ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(TradingFeeLevelEditDialogComponent, { data: { tradingFeeId: this.tradingFeeId, tradingFeeLevel }, width: '400px' });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.layoutUtilsService.showActionNotification(saveMessage, messageType, 1000, true, false);
      this.load();
    });
  }

  delete(tradingFeeLevel: TradingFeeLevel) {
    const dialogRef = this.layoutUtilsService.deleteElement('Trading Fee Level Delete', 'Are you sure to permanently delete this fee level?', 'Trading fee level is deleting...');
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.tradingFeeService.deleteLevel(tradingFeeLevel.id)
          .subscribe(
            response => {
              this.layoutUtilsService.showActionNotification('Trading fee level has been deleted.', MessageType.Delete, 3000, true, false);
              this.load();
            },
            error => {
              this.layoutUtilsService.showActionNotification('An error occurred while deleting trading fee level.', MessageType.Update, 3000, true, false);
            }
          );
      });
  }
}
