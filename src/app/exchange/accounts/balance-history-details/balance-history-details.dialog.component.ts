import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { getBalanceHistoryTypeTitle } from '../../shared/utils'

import { AccountDataService } from '../../api/account-data.service';
import { BalanceHistoryDetails } from '../../api/models/balances/balance-history-details.interface';
import { BalanceHistoryType } from '../../api/models/balances/balance-history-type';

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

  private balanceHistoryId: string;

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
