import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { getProductTitle } from '../enum-name.util';

import { Template, Channel } from '../../api/models/notifications';
import { TemplateService } from '../../api/services';

@Component({
  selector: 'kt-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private templateService: TemplateService) { }

  private templateId: string;
  private subscriptions: Subscription[] = [];

  template: Template;
  templateName: string = '';
  productTitle: string = '';

  channelEmail = Channel.Email;
  channelSms = Channel.Sms;
  channelPush = Channel.Push;

  ngOnInit() {
    const routeSubscription = this.route.params
      .subscribe(params => {
        this.templateId = params['templateId'];
        this.load();
      });

    this.subscriptions.push(routeSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.templateService.getById(this.templateId)
      .subscribe(template => {
        this.template = template;
        this.productTitle = getProductTitle(template.product);
        this.templateName = template.name;
        this.cdr.markForCheck();
      });
  }

  personalize() {
    this.templateService.personalize(this.templateId)
      .subscribe(template => {
        this.layoutUtilsService.showActionNotification('Template is personalized.', MessageType.Update, 3000, true, false);
        this.router.navigate(['../', template.id], { relativeTo: this.route });
      });
  }

  restore() {
    const dialogRef = this.layoutUtilsService.confirmElement('Restore template', 'Are you sure you want to restore to default?', 'Template is restoring...', 'Restore');
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.templateService.restore(this.templateId)
          .subscribe(() => {
            this.layoutUtilsService.showActionNotification('Template is restored.', MessageType.Update, 3000, true, false);
            this.router.navigate(['../'], { relativeTo: this.route });
          });
      });
  }
}
