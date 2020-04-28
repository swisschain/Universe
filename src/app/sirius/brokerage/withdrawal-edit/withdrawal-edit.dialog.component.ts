import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { v4 as uuidv4 } from 'uuid';

import { markFormGroupTouched, isFormGroupControlHasError, setFormError, getCommonError } from '../../shared/validation-utils'

import { Subscription, forkJoin } from 'rxjs';

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
  private requestId = uuidv4();

  form: FormGroup;
  destinationRequisitesForm: FormGroup;
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

    this.viewLoading = true;
    forkJoin([
      this.brokerAccountService.get(),
      this.blockchainsService.get(),
      this.assetsService.getAll()
    ]).subscribe(result => {
      this.brokerAccounts = result[0].items;
      this.blockchains = result[1].items;
      this.assets = result[2].items;
      this.viewLoading = false;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  createForm() {
    this.destinationRequisitesForm = this.fb.group({
      address: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(100)]
      )]
    });

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
      destinationRequisites: this.destinationRequisitesForm
    });
  }

  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.form.controls;

    if (this.form.invalid) {
      markFormGroupTouched(this.form);
      return;
    }

    this.create(controls.brokerAccountId.value,
      controls.accountId.value,
      controls.referenceId.value,
      controls.assetId.value,
      controls.amount.value,
      this.destinationRequisitesForm.controls.address.value);
  }

  create(brokerAccountId: number, accountId: number, referenceId: string, assetId: number, amount: number, address: string) {
    this.viewLoading = true;
    this.withdrawalService.create(brokerAccountId, accountId, referenceId, assetId, amount, address, this.requestId)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ withdrawal: response, isEdit: true });
        },
        errorResponse => {
          const errorMessage = getCommonError(errorResponse);
          if (errorMessage) {
            this.hasFormErrors = true;
            this.errorMessage = errorMessage;
          }
          setFormError(this.form, errorResponse);
          this.viewLoading = false;
          this.cdr.markForCheck();
        }
      );
  }

  isFormControlHasError(controlName: string, validationType: string): boolean {
    return isFormGroupControlHasError(this.form, controlName, validationType);
  }

  isDestinationRequisitesFormControlHasError(controlName: string, validationType: string): boolean {
    return isFormGroupControlHasError(this.destinationRequisitesForm, controlName, validationType);
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
    this.errorMessage = '';
  }
}
