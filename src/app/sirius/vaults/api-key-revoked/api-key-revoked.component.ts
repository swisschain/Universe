import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';

import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { VaultService } from '../../api/services';
import { VaultApiKeyDataSource } from '../../data-sources';

@Component({
  selector: 'kt-api-key-revoked',
  templateUrl: './api-key-revoked.component.html',
  styleUrls: ['./api-key-revoked.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiKeyRevokedComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private vaultService: VaultService) { }

  private subscriptions: Subscription[] = [];
  private vaultId: number = null;

  searchByNameInput = new FormControl();

  dataSource: VaultApiKeyDataSource;
  displayedColumns = ['apiKeyId', 'name', 'expiresAt', 'issuedAt'];

  name = '';

  ngOnInit() {
    this.dataSource = new VaultApiKeyDataSource(this.vaultService);

    const routeSubscription = this.route.params.subscribe(params => {
      this.vaultId = params['vaultId'];
      this.load();
    });
    this.subscriptions.push(routeSubscription);

    const searchByNameSubscription = this.searchByNameInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.name = value;
        this.load();
      });
    this.subscriptions.push(searchByNameSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load(this.vaultId, this.name, true);
  }
}
