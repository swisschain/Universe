import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { v4 as uuidv4 } from 'uuid';

import { getVaultTypeTitle } from '../../shared/utils'

import { markFormGroupTouched, isFormGroupControlHasError, setFormError, getCommonError } from '../../shared/validation-utils'

import { Vault, VaultType } from '../../api/models/vaults';
import { BrokerAccountService, VaultService } from '../../api/services';

@Component({
  selector: 'kt-broker-account-edit-dialog',
  templateUrl: './broker-account-edit.dialog.component.html',
  styleUrls: ['./broker-account-edit.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class BrokerAccountEditDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BrokerAccountEditDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private brokerAccountService: BrokerAccountService,
    private vaultService: VaultService) {
  }

  private requestId = uuidv4();

  vaults: Vault[] = [];
  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  ngOnInit(): void {
    this.createForm();
    this.load();
  }

  createForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50)
      ])],
      vaultId: [null, Validators.compose([
        Validators.required
      ])]
    });
  }

  load(): void {
    this.viewLoading = true;
    this.vaultService.getAll()
      .subscribe(vaults => {
        this.vaults = vaults;
        this.viewLoading = false;
        this.cdr.markForCheck();
      });
  }

  getVaultTypeTitle(type: VaultType): string {
    return getVaultTypeTitle(type);
  }

  onSubmit(): void {
    this.hasFormErrors = false;

    if (this.form.invalid) {
      markFormGroupTouched(this.form);
      return;
    }

    const controls = this.form.controls;

    this.create(controls.name.value, controls.vaultId.value);
  }

  create(name: string, vaultId: number): void {
    this.viewLoading = true;
    this.brokerAccountService.create(name, vaultId, this.requestId)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ account: response });
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

  onAlertClose($event): void {
    this.hasFormErrors = false;
    this.errorMessage = '';
  }
}
