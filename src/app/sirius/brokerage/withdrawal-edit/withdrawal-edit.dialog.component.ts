import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { Asset } from '../../api/models/assets/asset.interface';
import { AssetsService } from '../../api/assets.service';
import { WithdrawalService } from '../../api/withdrawal.service';
import { BrokerAccountService } from '../../api/broker-account.service';
import { BlockchainsService } from '../../api/blockchains.service';
import { BrokerAccount } from '../../api/models/brocker-account/broker-account.interface';
import { Blockchain } from '../../api/models/blockchains/blockchain.interface';

@Component({
  selector: 'kt-withdrawal-edit-dialog',
  templateUrl: './withdrawal-edit.dialog.component.html',
  styleUrls: ['./withdrawal-edit.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class WithdrawalEditDialogComponent implements OnInit, OnDestroy {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WithdrawalEditDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private assetsService: AssetsService,
    private brokerAccountService: BrokerAccountService,
    private blockchainsService: BlockchainsService,
    private withdrawalService: WithdrawalService) {
  }

  private subscriptions: Subscription[] = [];

  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  brokerAccounts: BrokerAccount[];
  blockchains: Blockchain[];
  assets: Asset[];
  filteredAssets: Asset[];

  ngOnInit() {
    this.createForm();

    const blockchainIdSubscription = this.form.get('blockchainId').valueChanges
      .subscribe(value => {
        this.form.controls.assetId.setValue(null);
        this.filteredAssets = this.assets.filter(asset => asset.blockchainId === value);
      });

    this.subscriptions.push(blockchainIdSubscription);

    this.loadBrokerAccounts();
    this.loadBlockchains();
    this.loadAssets();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadBrokerAccounts() {
    this.brokerAccountService.get()
      .subscribe(result => {
        this.brokerAccounts = result.items;
      });
  }

  loadBlockchains() {
    this.blockchainsService.get()
      .subscribe(result => {
        this.blockchains = result.items;
      });
  }

  loadAssets() {
    this.assetsService.getAll()
      .subscribe(result => {
        this.assets = result.items;
      });
  }

  createForm() {
    this.form = this.fb.group({
      brokerAccountId: [null, Validators.compose([
        Validators.required]
      )],
      accountId: [null, Validators.compose([
        Validators.min(0)]
      )],
      referenceId: [null, Validators.compose([
        Validators.maxLength(100)]
      )],
      blockchainId: [null, Validators.compose([
        Validators.required]
      )],
      assetId: [null, Validators.compose([
        Validators.required]
      )],
      amount: [null, Validators.compose([
        Validators.required,
        Validators.min(0)]
      )],
      address: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(100)]
      )]
    });
  }

  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.form.controls;

    if (this.form.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.create(controls.brokerAccountId.value,
      controls.accountId.value,
      controls.referenceId.value,
      controls.assetId.value,
      controls.amount.value,
      controls.address.value);
  }

  create(brokerAccountId: number, accountId: number, referenceId: string, assetId: number, amount: number, address: string) {
    this.viewLoading = true;
    this.withdrawalService.create(brokerAccountId, accountId, referenceId, assetId, amount, address)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ withdrawal: response, isEdit: true });
        },
        error => {
          this.viewLoading = false;
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while creating withdrawal.';
          this.cdr.markForCheck();
        }
      );
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.form.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
    this.errorMessage = '';
  }
}
