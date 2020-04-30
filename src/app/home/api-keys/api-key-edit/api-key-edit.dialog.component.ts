import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { markFormGroupTouched, isFormGroupControlHasError, setFormError, getCommonError, getProductName } from '../../shared/utils'

import { ApiKey, Product } from '../../api/models/api-keys';
import { ApiKeyService } from '../../api/services';

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
    private apiKeyService: ApiKeyService) {
  }

  private apiKey: ApiKey;
  private products = [Product.Exchange, Product.Sirius];

  minExpirationDate: Date;
  maxExpirationDate: Date;

  apiKeyId: string;
  form: FormGroup;
  productsForm = new FormArray([]);
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  ngOnInit() {
    this.minExpirationDate = new Date();
    this.maxExpirationDate = new Date(this.minExpirationDate.getFullYear() + 20, 11, 31);

    this.apiKeyId = this.data.apiKeyId;
    this.createForm();
    this.load();
  }

  load() {
    this.viewLoading = true;
    if (this.apiKeyId) {
      this.apiKeyService.getById(this.apiKeyId)
        .subscribe(apiKey => {
          this.apiKey = apiKey;
          this.addContents();
          this.viewLoading = false;
        });
    }
    else {
      this.addContents();
      this.viewLoading = false;
    }
  }

  createForm() {
    this.form = this.fb.group({
      name: [{ value: '', disabled: this.apiKeyId ? true : false }, Validators.compose([
        Validators.required,
        Validators.maxLength(50)]
      )],
      description: ['', Validators.compose([
        Validators.maxLength(500)]
      )],
      expirationDate: [{ value: Date.now(), disabled: this.apiKeyId ? true : false }, Validators.compose([
        Validators.required,
        Validators.maxLength(500)]
      )],
      products: this.productsForm
    });
  }

  addContents() {
    if (this.apiKey) {
      this.form.controls.name.setValue(this.apiKey.name);
      this.form.controls.description.setValue(this.apiKey.description);
      this.form.controls.expirationDate.setValue(this.apiKey.expirationDate);
    }
    this.products.forEach(product => {
      let apiKeyProduct = null;
      if (this.apiKey) {
        apiKeyProduct = this.apiKey.products.filter(o => o === product)[0];
      }
      this.productsForm.push(this.fb.group({
        product: [product],
        isSelected: [{ value: apiKeyProduct ? true : false, disabled: this.apiKeyId ? true : false }, Validators.compose([
          Validators.required,
          Validators.maxLength(20)]
        )]
      }))
    });
  }

  onSubmit() {
    this.hasFormErrors = false;

    if (this.form.invalid) {
      markFormGroupTouched(this.form);
      return;
    }

    const apiKey = this.prepare();

    if (apiKey.products.length === 0) {
      this.errorMessage = 'At least one product should be selected';
      this.hasFormErrors = true;
      return;
    }

    if (apiKey.id) {
      this.update(apiKey);
    } else {
      this.create(apiKey);
    }
  }

  private prepare(): ApiKey {
    const products = [];
    this.productsForm.controls.forEach((fromGroup: FormGroup) => {
      if (fromGroup.controls.isSelected.value === true) {
        products.push(fromGroup.controls.product.value)
      }
    })

    const controls = this.form.controls;

    const expirationDate = controls.expirationDate.value;
    expirationDate.setHours(23, 59, 59);

    return {
      id: this.apiKeyId,
      name: controls.name.value,
      description: controls.description.value,
      expirationDate: controls.expirationDate.value,
      products: products,
      isDeleted: null,
      created: null,
      modified: null
    };
  }

  private create(apiKey: ApiKey) {
    this.viewLoading = true;
    this.apiKeyService.create(apiKey)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ apiKey, isEdit: true });
        },
        errorResponse => {
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while creating API key';
          this.viewLoading = false;
          this.cdr.markForCheck();
        }
      );
  }

  private update(apiKey: ApiKey) {
    this.viewLoading = true;
    this.apiKeyService.update(apiKey)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ apiKey, isEdit: true });
        },
        errorResponse => {
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while updating API key';
          this.viewLoading = false;
          this.cdr.markForCheck();
        }
      );
  }

  getProductName(product: Product) {
    return getProductName(product);
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    return isFormGroupControlHasError(this.form, controlName, validationType);
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
    this.errorMessage = '';
  }
}
