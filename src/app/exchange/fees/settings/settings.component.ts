import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Account } from '../../api/models/accounts/account.interface';
import { AccountService, FeeSettingsService } from '../../api/services';

@Component({
  selector: 'kt-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private cdr: ChangeDetectorRef,
    private accountService: AccountService,
    private feeSettingsService: FeeSettingsService) { }

  account: Account;

  ngOnInit() {
    this.load();
  }

  load() {
    this.feeSettingsService.get()
      .subscribe(settings => {
        this.accountService.getById(settings.payload.feeWalletId)
          .subscribe(account => {
            this.account = account;
            this.cdr.markForCheck();
          });
      });
  }
}
