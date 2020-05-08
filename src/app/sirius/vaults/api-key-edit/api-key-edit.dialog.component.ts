import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { v4 as uuidv4 } from 'uuid';

import { markFormGroupTouched, isFormGroupControlHasError, setFormError, getCommonError } from '../../shared/validation-utils'

import { VaultService } from '../../api/services';

@Component({
  selector: 'kt-api-key-edit-dialog',
  templateUrl: './api-key-edit.dialog.component.html',
  styleUrls: ['./api-key-edit.dialog.component.scss']
})
export class ApiKeyEditDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ApiKeyEditDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private vaultService: VaultService) {
  }

  private requestId = uuidv4();

  minExpirationDate: Date;
  maxExpirationDate: Date;

  vaultId: number;

  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  ngOnInit() {
    this.minExpirationDate = new Date();
    this.maxExpirationDate = new Date(this.minExpirationDate.getFullYear() + 20, 11, 31);

    this.vaultId = this.data.vaultId;
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(100)]
      )],
      expiresAt: [Date.now(), Validators.compose([
        Validators.required]
      )]
    });
  }

  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.form.controls;

    if (this.form.invalid) {
      markFormGroupTouched(this.form);
      return;
    }

    this.create(controls.name.value, controls.expiresAt.value);
  }

  create(name: string, expiresAt: Date) {
    this.viewLoading = true;
    this.vaultService.addApiKey(this.vaultId, name, expiresAt, this.requestId)
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
