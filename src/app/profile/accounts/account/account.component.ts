import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UsersService } from '../../api/users.service';
import { User } from '../../api/models/users/user.intreface';
import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

@Component({
  selector: 'kt-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private usersService: UsersService,
    private layoutUtilsService: LayoutUtilsService) {
  }

  user: User;
  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  ngOnInit() {
    this.usersService.get()
    .subscribe(user => {
      this.user = user;
      this.createForm();
      this.cdr.markForCheck();
    });
    
  }

  createForm() {
    this.form = this.fb.group({
      userName: [this.user.username, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)]
      )],
      email: [this.user.email, Validators.compose([
        Validators.required,
        Validators.email,
        Validators.maxLength(320)]
      )],
    });
  }

  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.form.controls;

    if (this.form.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.update(controls.userName.value, controls.email.value);
  }

  update(userName: string, email: string) {
    this.viewLoading = true;
    this.usersService.update(userName, email)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.layoutUtilsService.showActionNotification('User profile updated', MessageType.Update, 1000, true, false);
        },
        error => {
          this.viewLoading = false;
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while updating user profile.';
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
