import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessageType, LayoutUtilsService } from '../../../core/_base/crud';
import { BrokerAccountService } from '../../api/broker-account.service';

@Component({
  selector: 'kt-broker-account-edit-dialog',
  templateUrl: './broker-account-edit.dialog.component.html',
  styleUrls: ['./broker-account-edit.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class BrokerAccountEditDialogComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BrokerAccountEditDialogComponent>,
    private fb: FormBuilder,
    private brokerAccountService: BrokerAccountService,
    private layoutUtilsService: LayoutUtilsService) {
  }

  form: FormGroup;
  hasFormErrors = false;
  viewLoading = false;

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])]
    });
  }

	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.form.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
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

    this.create(controls.name.value);
  }

  create(name: string) {
    this.viewLoading = true;
    this.brokerAccountService.create(name)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ account: response });
        },
        error => {
          this.viewLoading = false;
          this.layoutUtilsService.showActionNotification('An error occurred while creating broker account.', MessageType.Update, 3000, true, false);
        }
      );
  }
}
