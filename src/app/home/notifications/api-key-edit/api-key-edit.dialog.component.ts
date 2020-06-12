import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { markFormGroupTouched, isFormGroupControlHasError } from '../../shared/utils/validation-utils';

import { NotificationApiKey, Provider, Channel, Product } from '../../api/models/notifications';
import { NotificationApiKeyService, ProviderService } from '../../api/services';

@Component({
  selector: 'kt-notification-api-key-edit-dialog',
  templateUrl: './api-key-edit.dialog.component.html',
  styleUrls: ['./api-key-edit.dialog.component.scss']
})
export class NotificationApiKeyEditDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NotificationApiKeyEditDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private notificationApiKeyService: NotificationApiKeyService,
    private providerService: ProviderService) { }

  private apiKey: NotificationApiKey = null;

  providers: Provider[] = [];

  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  ngOnInit() {
    this.apiKey = this.data.apiKey;

    this.createForm();
    this.load();
  }

  load() {
    this.viewLoading = true;

    this.providerService.get()
      .subscribe(providers => {
        this.providers = providers;
        this.viewLoading = false;
        this.cdr.markForCheck();
      });
  }

  createForm() {
    this.form = this.fb.group({
      product: [{ value: this.apiKey ? this.apiKey.product : null, disabled: this.apiKey ? true : false }, Validators.compose([
        Validators.required]
      )],
      channel: [{ value: this.apiKey ? this.apiKey.channel : null, disabled: this.apiKey ? true : false }, Validators.compose([
        Validators.required]
      )],
      providerId: [{ value: this.apiKey ? this.apiKey.providerId : null, disabled: this.apiKey ? true : false }, Validators.compose([
        Validators.required]
      )],
      from: [this.apiKey ? this.apiKey.from : null, Validators.compose([
      ]
      )],
      value: [this.apiKey ? this.apiKey.value : null, Validators.compose([
        Validators.required]
      )],
    });
  }

  onSubmit() {
    this.hasFormErrors = false;

    if (this.form.invalid) {
      markFormGroupTouched(this.form);
      return;
    }

    const controls = this.form.controls;

    if (this.apiKey) {
      this.update(controls.providerId.value, controls.product.value, controls.channel.value, controls.from.value, controls.value.value);
    } else {
      this.create(controls.providerId.value, controls.product.value, controls.channel.value, controls.from.value, controls.value.value);
    }
  }

  private create(providerId: string, product: Product, channel: Channel, from: string, value: string) {
    this.viewLoading = true;
    this.notificationApiKeyService.add(providerId, product, channel, from, value)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ response, isEdit: true });
        },
        errorResponse => {
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while creating API key';
          this.viewLoading = false;
          this.cdr.markForCheck();
        }
      );
  }

  private update(providerId: string, product: Product, channel: Channel, from: string, value: string) {
    this.viewLoading = true;
    this.notificationApiKeyService.update(this.apiKey.id, providerId, product, channel, from, value)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ response, isEdit: true });
        },
        errorResponse => {
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while updating API key';
          this.viewLoading = false;
          this.cdr.markForCheck();
        }
      );
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    return isFormGroupControlHasError(this.form, controlName, validationType);
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
    this.errorMessage = '';
  }
}
