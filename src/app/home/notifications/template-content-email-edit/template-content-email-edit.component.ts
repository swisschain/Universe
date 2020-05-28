import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, forkJoin } from 'rxjs';

import { markFormGroupTouched, isFormGroupControlHasError } from '../../shared/utils/validation-utils'

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { Template, TemplateContent, Channel } from '../../api/models/notifications';
import { TemplateService } from '../../api/services';

@Component({
  selector: 'kt-template-content-email-edit',
  templateUrl: './template-content-email-edit.component.html',
  styleUrls: ['./template-content-email-edit.component.scss']
})
export class TemplateContentEmailEditComponent implements OnInit, OnDestroy {

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private layoutUtilsService: LayoutUtilsService,
    private templateService: TemplateService) { }

  private subscriptions: Subscription[] = [];
  private loadingSubject = new BehaviorSubject<boolean>(true);
  private templateId: string = null;
  private contentId: string = null;

  loading$: Observable<boolean>;

  languages = ['en-US', 'de-CH', 'ru-RU'];

  allowEdit: boolean = false;

  form: FormGroup;
  hasFormErrors = false;
  errorMessage = '';

  ngOnInit() {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);

    const routeSubscription = this.route.params
      .subscribe(params => {
        this.templateId = params['templateId'];
        const contentId = params['contentId'];
        if (contentId !== 'new') {
          this.contentId = contentId;
        }
        this.createForm();
        this.load();
      });

    this.subscriptions.push(routeSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.loadingSubject.next(true);
    if (this.contentId) {
      forkJoin([
        this.templateService.getById(this.templateId),
        this.templateService.getContentById(this.templateId, this.contentId)
      ])
        .subscribe(data => {
          this.setParameters(data[0]);
          this.setValues(data[1]);
          this.loadingSubject.next(false);
          this.cdr.markForCheck();
        });
    } else {
      this.templateService.getById(this.templateId)
        .subscribe(layout => {
          this.setParameters(layout);
          this.loadingSubject.next(false);
          this.cdr.markForCheck();
        });
    }
  }

  createForm() {
    this.form = this.fb.group({
      language: [{ value: '', disabled: this.contentId ? true : false }, Validators.required],
      subject: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(256)]
      )],
      content: ['', Validators.required]
    });
  }

  setValues(content: TemplateContent) {
    this.form.controls.language.setValue(content.language);
    this.form.controls.subject.setValue(content.subject);
    this.form.controls.content.setValue(content.content);
  }

  setParameters(template: Template) {
    this.allowEdit = template.isPersonalized;
    if (!template.isPersonalized) {
      this.form.controls.language.disable();
      this.form.controls.subject.disable();
      this.form.controls.content.disable();
    }
  }

  save() {
    this.hasFormErrors = false;

    if (this.form.invalid) {
      markFormGroupTouched(this.form);
      return;
    }

    const language = this.form.controls.language.value;
    const subject = this.form.controls.subject.value;
    const content = this.form.controls.content.value;

    if (this.contentId) {
      this.update(subject, content);
    } else {
      this.create(language, subject, content);
    }
  }

  private create(language: string, subject: string, content: string) {
    this.loadingSubject.next(true);
    this.templateService.addContent(this.templateId, language, Channel.Email, subject, content)
      .subscribe(
        response => {
          this.loadingSubject.next(false);
          this.layoutUtilsService.showActionNotification('Template content is added.', MessageType.Update, 3000, true, false);
          this.router.navigate(['../../'], { relativeTo: this.route });
        },
        errorResponse => {
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while creating template content';
          this.loadingSubject.next(false);
          this.cdr.markForCheck();
        }
      );
  }

  private update(subject: string, content: string) {
    this.loadingSubject.next(true);
    this.templateService.updateContent(this.templateId, this.contentId, subject, content)
      .subscribe(
        response => {
          this.loadingSubject.next(false);
          this.layoutUtilsService.showActionNotification('Template content is updated.', MessageType.Update, 3000, true, false);
        },
        errorResponse => {
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while updating template content';
          this.loadingSubject.next(false);
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
