import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Account } from '../../api/models/accounts/account.interface';
import { AccountsService } from '../../api/accounts.service';
import { FeeSettingsService } from '../../api/services';

@Component({
  selector: 'kt-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private accountsService: AccountsService,
    private feeSettingsService: FeeSettingsService) { }

  account: Account;

  ngOnInit() {
    this.load();
  }

  load() {
    this.feeSettingsService.get()
      .subscribe(settings => {
        this.accountsService.getById(settings.payload.feeWalletId)
          .subscribe(account => {
            this.account = account;
            this.cdr.markForCheck();
          });
      });
  }
}
