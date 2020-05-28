import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, forkJoin } from 'rxjs';

import { markFormGroupTouched, isFormGroupControlHasError } from '../../shared/utils/validation-utils'

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { Layout, LayoutContent } from '../../api/models/notifications';
import { LayoutService } from '../../api/services';

@Component({
  selector: 'kt-layout-content-edit',
  templateUrl: './layout-content-edit.component.html',
  styleUrls: ['./layout-content-edit.component.scss']
})
export class LayoutContentEditComponent implements OnInit, OnDestroy {

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private layoutUtilsService: LayoutUtilsService,
    private layoutService: LayoutService) { }

  private subscriptions: Subscription[] = [];
  private loadingSubject = new BehaviorSubject<boolean>(true);
  private layoutId: string = null;
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
        this.layoutId = params['layoutId'];
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
        this.layoutService.getById(this.layoutId),
        this.layoutService.getContentById(this.layoutId, this.contentId)
      ])
        .subscribe(data => {
          this.setParameters(data[0]);
          this.setValues(data[1]);
          this.loadingSubject.next(false);
          this.cdr.markForCheck();
        });
    } else {
      this.layoutService.getById(this.layoutId)
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
      content: ['', Validators.required]
    });
  }

  setValues(content: LayoutContent) {
    this.form.controls.language.setValue(content.language);
    this.form.controls.content.setValue(content.content);
  }

  setParameters(layout: Layout) {
    this.allowEdit = layout.isPersonalized;
    if (!layout.isPersonalized) {
      this.form.controls.language.disable();
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
    const content = this.form.controls.content.value;

    if (this.contentId) {
      this.update(content);
    } else {
      this.create(language, content);
    }
  }

  private create(language: string, content: string) {
    this.loadingSubject.next(true);
    this.layoutService.addContent(this.layoutId, language, content)
      .subscribe(
        response => {
          this.loadingSubject.next(false);
          this.layoutUtilsService.showActionNotification('Layout content is added.', MessageType.Update, 3000, true, false);
          this.router.navigate(['../../'], { relativeTo: this.route });
        },
        errorResponse => {
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while creating layout content';
          this.loadingSubject.next(false);
          this.cdr.markForCheck();
        }
      );
  }

  private update(content: string) {
    this.loadingSubject.next(true);
    this.layoutService.updateContent(this.layoutId, this.contentId, content)
      .subscribe(
        response => {
          this.loadingSubject.next(false);
          this.layoutUtilsService.showActionNotification('Layout content is updated.', MessageType.Update, 3000, true, false);
        },
        errorResponse => {
          this.hasFormErrors = true;
          this.errorMessage = 'An error occurred while updating layout content';
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
