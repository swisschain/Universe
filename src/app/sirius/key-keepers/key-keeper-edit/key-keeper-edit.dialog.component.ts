import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { v4 as uuidv4 } from 'uuid';

import { markFormGroupTouched, isFormGroupControlHasError, setFormError, getCommonError } from '../../shared/validation-utils'

import { KeyKeeper } from '../../api/models/key-keepers';
import { KeyKeeperService } from '../../api/services';

@Component({
  selector: 'kt-key-keeper-edit-dialog',
  templateUrl: './key-keeper-edit.dialog.component.html',
  styleUrls: ['./key-keeper-edit.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class KeyKeeperEditDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<KeyKeeperEditDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private keyKeeperService: KeyKeeperService) {
  }

  private requestId = uuidv4();

  keyKeeperId: number = null;

  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  ngOnInit() {
    this.keyKeeperId = this.data.keyKeeperId;
    this.createForm();
    this.load();
  }

  load() {
    if (this.keyKeeperId) {
      this.viewLoading = true;
      this.keyKeeperService.getById(this.keyKeeperId)
        .subscribe(keyKeeper => {
          this.setData(keyKeeper);
          this.viewLoading = false;
        });
    }
  }

  setData(keyKeeper: KeyKeeper) {
    this.form.controls.externalId.setValue(keyKeeper.externalId);
    this.form.controls.description.setValue(keyKeeper.description);
  }

  createForm() {
    this.form = this.fb.group({
      externalId: [{ value: '', disabled: this.keyKeeperId ? true : false }, Validators.compose([
        Validators.required,
        Validators.maxLength(500)]
      )],
      description: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(1000)]
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

    if (!this.keyKeeperId) {
      this.create(controls.externalId.value, controls.description.value);
    }
    else {
      this.update(controls.description.value);
    }
  }

  create(externalId: string, description: string) {
    this.viewLoading = true;
    this.keyKeeperService.create(externalId, description, this.requestId)
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

  update(description: string) {
    this.viewLoading = true;
    this.keyKeeperService.update(this.keyKeeperId, description, this.requestId)
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
