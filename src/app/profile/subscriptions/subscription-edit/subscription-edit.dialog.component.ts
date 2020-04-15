import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MessageType, LayoutUtilsService } from '../../../core/_base/crud';

import { SubscriptionsService } from '../../api/subscriptions.service';
import { Subscription as UserSubscription } from '../../api/models/subscriptions/subscription.interface'

@Component({
  selector: 'kt-subscription-edit',
  templateUrl: './subscription-edit.dialog.component.html',
  styleUrls: ['./subscription-edit.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SubscriptionEditDialogComponent implements OnInit, OnDestroy {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SubscriptionEditDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private subscriptionsService: SubscriptionsService) {
  }

  private subscriptions: Subscription;

  subscription: UserSubscription;
  form: FormGroup;
  hasFormErrors = false;
  viewLoading = false;

  ngOnInit() {
    this.subscription = this.data.subscription;
    this.createForm();
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  createForm() {
    this.form = this.fb.group({
      name: [this.subscription.name, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)]
      )],
      description: [this.subscription.description, Validators.maxLength(300)]
    });
  }

  getTitle(): string {
    if (this.subscription.id) {
      return 'Edit subscription';
    }

    return 'New subscription';
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

    const name = controls.name.value;
    const description = controls.description.value;

    if (this.subscription.id) {
      this.update(name, description);
    } else {
      this.create(name, description);
    }
  }

  create(name: string, description: string) {
    this.viewLoading = true;
    this.subscriptionsService.add(name, description)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.cdr.markForCheck();
          this.dialogRef.close({ isEdit: true });
        },
        error => {
          this.viewLoading = false;
          this.cdr.markForCheck();
          this.layoutUtilsService.showActionNotification('An error occurred while adding subscription.', MessageType.Update, 3000, true, false);
        }
      );
  }

  update(name: string, description: string) {
    this.viewLoading = true;
    this.subscriptionsService.update(this.subscription.id, name, description)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.cdr.markForCheck();
          this.dialogRef.close({ isEdit: true });
        },
        error => {
          this.viewLoading = false;
          this.cdr.markForCheck();
          this.layoutUtilsService.showActionNotification('An error occurred while updating subscription.', MessageType.Update, 3000, true, false);
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
}
