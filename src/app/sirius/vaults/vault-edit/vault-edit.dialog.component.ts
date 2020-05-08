import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { v4 as uuidv4 } from 'uuid';

import { markFormGroupTouched, isFormGroupControlHasError, setFormError, getCommonError } from '../../shared/validation-utils'

import { getVaultTypeTitle } from '../../shared/utils'

import { Vault, VaultType } from '../../api/models/vaults';
import { VaultService } from '../../api/services';

@Component({
  selector: 'kt-vault-edit-dialog',
  templateUrl: './vault-edit.dialog.component.html',
  styleUrls: ['./vault-edit.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class VaultEditDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VaultEditDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private vaultService: VaultService) {
  }

  private requestId = uuidv4();

  vaultId: number = null;

  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  types = [VaultType.Private, VaultType.Shared];

  ngOnInit() {
    this.vaultId = this.data.vaultId;
    this.createForm();
    this.load();
  }

  load() {
    if (this.vaultId) {
      this.viewLoading = true;
      this.vaultService.getById(this.vaultId)
        .subscribe(vault => {
          this.setData(vault);
          this.viewLoading = false;
        });
    }
  }

  setData(vault: Vault) {
    this.form.controls.name.setValue(vault.name);
    this.form.controls.type.setValue(vault.type);
  }

  getVaultTypeTitle(type: VaultType) {
    return getVaultTypeTitle(type);
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(100)]
      )],
      type: [{ value: '', disabled: this.vaultId ? true : false }, Validators.compose([
        Validators.required]
      )],
    });
  }

  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.form.controls;

    if (this.form.invalid) {
      markFormGroupTouched(this.form);
      return;
    }

    if (!this.vaultId) {
      this.create(controls.name.value, controls.type.value);
    }
    else {
      this.update(controls.name.value);
    }
  }

  create(name: string, type: VaultType) {
    this.viewLoading = true;
    this.vaultService.create(name, type, this.requestId)
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

  update(name: string) {
    this.viewLoading = true;
    this.vaultService.update(this.vaultId, name, this.requestId)
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

  onAlertClose($event) {
    this.hasFormErrors = false;
    this.errorMessage = '';
  }
}
