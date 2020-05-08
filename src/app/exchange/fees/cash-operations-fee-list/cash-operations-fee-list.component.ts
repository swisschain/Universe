import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { CashOperationsFee, FeeType } from '../../api/models/fees';

import { AssetsService } from '../../api/assets.service';
import { CashOperationsFeeService } from '../../api/services';

import { CashOperationsFeeDataSource } from '../../data-sources';
import { CashOperationsFeeEditDialogComponent } from '../cash-operations-fee-edit/cash-operations-fee-edit.dialog.component';

@Component({
  selector: 'kt-cash-operations-fee-list',
  templateUrl: './cash-operations-fee-list.component.html',
  styleUrls: ['./cash-operations-fee-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashOperationsFeeListComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private assetsService: AssetsService,
    private cashOperationsFeeService: CashOperationsFeeService) { }

  private subscriptions: Subscription[] = [];

  searchByAssetInput = new FormControl();

  assets: string[] = [];
  filteredAssets: Observable<string[]>;

  dataSource: CashOperationsFeeDataSource;
  displayedColumns = ['asset', 'cashIn', 'cashOut', 'transfer', 'created', 'modified', 'actions'];

  asset = '';

  ngOnInit() {
    this.dataSource = new CashOperationsFeeDataSource(this.cashOperationsFeeService);

    const searchByAssetSubscription = this.searchByAssetInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.asset = value;
        this.load();
      });
    this.subscriptions.push(searchByAssetSubscription);

    this.filteredAssets = this.searchByAssetInput.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          const filterValue = value.toLowerCase();
          return this.assets.filter(asset => asset.toLowerCase().includes(filterValue));
        })
      );

    this.load();
    this.loadAssets();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load(this.asset);
  }

  loadAssets() {
    this.assetsService.getAll()
      .subscribe(assets => {
        this.assets = assets.map(item => item.symbol);
      });
  }

  isPercentage(feeType: FeeType) {
    return feeType === FeeType.Percentage;
  }

  add() {
    this.edit(null);
  }

  edit(cashOperationsFeeId: string) {
    const saveMessage = cashOperationsFeeId ? 'Cash operations fee updated' : 'Cash operations fee added';
    const messageType = cashOperationsFeeId ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(CashOperationsFeeEditDialogComponent, { data: { cashOperationsFeeId }, width: '600px' });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.layoutUtilsService.showActionNotification(saveMessage, messageType, 1000, true, false);
      this.load();
    });
  }

  delete(cashOperationsFee: CashOperationsFee) {
    const dialogRef = this.layoutUtilsService.deleteElement('Cash Operations Fee Delete', 'Are you sure to permanently delete this fee?', 'Cash operations fee is deleting...');
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.cashOperationsFeeService.delete(cashOperationsFee.id)
          .subscribe(
            response => {
              this.layoutUtilsService.showActionNotification('Cash operations fee has been deleted.', MessageType.Delete, 3000, true, false);
              this.load();
            },
            error => {
              this.layoutUtilsService.showActionNotification('An error occurred while deleting cash operations fee.', MessageType.Update, 3000, true, false);
            }
          );
      });
  }
}
