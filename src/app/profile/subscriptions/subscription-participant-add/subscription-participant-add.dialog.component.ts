import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MessageType, LayoutUtilsService } from '../../../core/_base/crud';

import { SubscriptionsService } from '../../api/subscriptions.service';

@Component({
  selector: 'kt-subscription-participant-add-dialog',
  templateUrl: './subscription-participant-add.dialog.component.html',
  styleUrls: ['./subscription-participant-add.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SubscriptionParticipantAddDialogComponent implements OnInit, OnDestroy {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SubscriptionParticipantAddDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private subscriptionsService: SubscriptionsService) {
  }

  private subscriptions: Subscription;

  subscriptionId: string;
  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  ngOnInit() {
    this.subscriptionId = this.data.subscriptionId;
    this.createForm();
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  createForm() {
    this.form = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(320)]
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

      this.hasFormErrors = true;
      return;
    }

    const email = controls.email.value;

    this.add(email);
  }

  add(email: string) {
    this.viewLoading = true;
    this.subscriptionsService.addParticipant(this.subscriptionId, email)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.cdr.markForCheck();
          this.dialogRef.close({ isEdit: true });
        },
        error => {
          this.viewLoading = false;
          this.hasFormErrors = true;
          this.errorMessage = error.error;          
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
