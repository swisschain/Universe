import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject, Observable } from 'rxjs';

import { v4 as uuidv4 } from 'uuid';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { markFormGroupTouched, isFormGroupControlHasError, setFormError, getCommonError } from '../../shared/validation-utils'

import { KeyKeepingConfiguration } from '../../api/models/key-keeping-configurations';
import { KeyKeepingConfigurationService } from '../../api/services';

@Component({
  selector: 'kt-key-keeping-configuration',
  templateUrl: './key-keeping-configuration.component.html',
  styleUrls: ['./key-keeping-configuration.component.scss']
})
export class KeyKeepingConfigurationComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private keyKeepingConfigurationService: KeyKeepingConfigurationService,
    private layoutUtilsService: LayoutUtilsService) {
  }

  private loadingSubject = new BehaviorSubject<boolean>(true);

  loading$: Observable<boolean>;

  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';

  createdAt: Date;
  updatedAt: Date;

  ngOnInit() {
    this.loading$ = this.loadingSubject.asObservable();
    this.createForm();
    this.loadingSubject.next(true);
    this.keyKeepingConfigurationService.get()
      .subscribe(keyKeepingConfiguration => {
        this.setData(keyKeepingConfiguration);
        this.loadingSubject.next(false);
      });
  }

  setData(keyKeepingConfiguration: KeyKeepingConfiguration) {
    if (keyKeepingConfiguration) {
      this.form.controls.activateApprovementsCount.setValue(keyKeepingConfiguration.activateApprovementsCount);
      this.form.controls.manualTransactionApprovementsCount.setValue(keyKeepingConfiguration.manualTransactionApprovementsCount);
      this.createdAt = keyKeepingConfiguration.createdAt;
      this.updatedAt = keyKeepingConfiguration.updatedAt;
    }
  }

  createForm() {
    this.form = this.fb.group({
      activateApprovementsCount: [null, Validators.compose([
        Validators.required,
        Validators.min(1),
        Validators.max(100)]
      )],
      manualTransactionApprovementsCount: [null, Validators.compose([
        Validators.required,
        Validators.min(1),
        Validators.max(100)]
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

    this.update(controls.activateApprovementsCount.value, controls.manualTransactionApprovementsCount.value);
  }

  update(activateApprovementsCount: number, manualTransactionApprovementsCount: number) {
    this.loadingSubject.next(true);
    this.keyKeepingConfigurationService.update(activateApprovementsCount, manualTransactionApprovementsCount, uuidv4())
      .subscribe(
        response => {
          this.loadingSubject.next(false);
          this.layoutUtilsService.showActionNotification('Key keeping configuration updated', MessageType.Update, 1000, true, false);
          this.createdAt = response.createdAt;
          this.updatedAt = response.updatedAt;
        },
        errorResponse => {
          const errorMessage = getCommonError(errorResponse);
          if (errorMessage) {
            this.hasFormErrors = true;
            this.errorMessage = errorMessage;
          }
          setFormError(this.form, errorResponse);
          this.loadingSubject.next(false);
          this.layoutUtilsService.showActionNotification('An error occurred while updating key keeping configuration', MessageType.Update, 1000, true, false);
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
