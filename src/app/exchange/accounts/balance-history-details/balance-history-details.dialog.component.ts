import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { getBalanceHistoryTypeTitle } from '../../shared/utils'

import { AccountDataService } from '../../api/services';
import { BalanceHistoryType, BalanceHistoryDetails } from '../../api/models/balances';

@Component({
  selector: 'kt-balance-history-details-dialog',
  templateUrl: './balance-history-details.dialog.component.html',
  styleUrls: ['./balance-history-details.dialog.component.scss']
})
export class BalanceHistoryDetailsDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef,
    private accountDataService: AccountDataService) {
  }

  private balanceHistoryId: number;

  viewLoading = false;
  balanceHistoryDetails: BalanceHistoryDetails;

  ngOnInit() {
    this.balanceHistoryId = this.data.balanceHistoryId;

    this.viewLoading = true;
    this.accountDataService.getBalanceHistoryDetails(this.balanceHistoryId)
      .subscribe(balanceHistoryDetails => {
        this.balanceHistoryDetails = balanceHistoryDetails;
        this.viewLoading = false;
        this.cdr.markForCheck();
      });
  }

  getTypeTitle(balanceHistoryType: BalanceHistoryType) {
    return getBalanceHistoryTypeTitle(balanceHistoryType);
  }
}
