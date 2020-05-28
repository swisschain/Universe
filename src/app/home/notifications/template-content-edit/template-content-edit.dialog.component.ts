import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, forkJoin } from 'rxjs';

import { markFormGroupTouched, isFormGroupControlHasError } from '../../shared/utils/validation-utils'

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { Template, TemplateContent, Channel } from '../../api/models/notifications';
import { TemplateService } from '../../api/services';

@Component({
  selector: 'kt-template-content-edit-dialog',
  templateUrl: './template-content-edit.dialog.component.html',
  styleUrls: ['./template-content-edit.dialog.component.scss']
})
export class TemplateContentEditDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TemplateContentEditDialogComponent>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private templateService: TemplateService) { }

  private templateId: string = null;
  private contentId: string = null;
  private channel: Channel = null;

  languages = ['en-US', 'de-CH', 'ru-RU'];

  allowEdit: boolean = false;

  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';
  viewLoading = false;

  ngOnInit() {
    this.templateId = this.data.templateId;
    this.contentId = this.data.contentId;
    this.channel = this.data.channel;

    this.createForm();
    this.load();
  }

  load() {
    this.viewLoading = true;
    if (this.contentId) {
      forkJoin([
        this.templateService.getById(this.templateId),
        this.templateService.getContentById(this.templateId, this.contentId)
      ])
        .subscribe(data => {
          this.setParameters(data[0]);
          this.setValues(data[1]);
          this.viewLoading = false;
          this.cdr.markForCheck();
        });
    } else {
      this.templateService.getById(this.templateId)
        .subscribe(layout => {
          this.setParameters(layout);
          this.viewLoading = false;
          this.cdr.markForCheck();
        });
    }
  }

  createForm() {
    this.form = this.fb.group({
      language: [{ value: '', disabled: this.contentId ? true : false }, Validators.required],
      content: ['', Validators.required]
    });
  }

  setValues(content: TemplateContent) {
    this.form.controls.language.setValue(content.language);
    this.form.controls.content.setValue(content.content);
  }

  setParameters(template: Template) {
    this.allowEdit = template.isPersonalized;
    if (!template.isPersonalized) {
      this.form.controls.language.disable();
      this.form.controls.content.disable();
    }
  }

  onSubmit() {
    this.hasFormErrors = false;

    if (this.form.invalid) {
      markFormGroupTouched(this.form);
      return;
    }

    const language = this.form.controls.language.value;
    const content = this.form.controls.content.value;

    if (this.contentId) {
      this.update(content);
    } else {
      this.create(language, content);
    }
  }

  private create(language: string, content: string) {
    this.viewLoading = true;
    this.templateService.addContent(this.templateId, language, this.channel, null, content)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ response, isEdit: true });
        },
        errorResponse => {
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while creating template content';
          this.viewLoading = false;
          this.cdr.markForCheck();
        }
      );
  }

  private update(content: string) {
    this.viewLoading = true;
    this.templateService.updateContent(this.templateId, this.contentId, null, content)
      .subscribe(
        response => {
          this.viewLoading = false;
          this.dialogRef.close({ response, isEdit: true });
        },
        errorResponse => {
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while updating template content';
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
