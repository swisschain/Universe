import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { getProductTitle } from '../enum-name.util';

import { Layout } from '../../api/models/notifications';
import { LayoutService } from '../../api/services';

@Component({
  selector: 'kt-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private layoutService: LayoutService) { }

  private layoutId: string;
  private subscriptions: Subscription[] = [];

  layout: Layout;
  productTitle: string = '';

  ngOnInit() {
    const routeSubscription = this.route.params
      .subscribe(params => {
        this.layoutId = params['layoutId'];
        this.load();
      });

    this.subscriptions.push(routeSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.layoutService.getById(this.layoutId)
      .subscribe(layout => {
        this.layout = layout;
        this.productTitle = getProductTitle(layout.product);
        this.cdr.markForCheck();
      });
  }

  personalize() {
    this.layoutService.personalize(this.layoutId)
      .subscribe(layout => {
        this.layoutUtilsService.showActionNotification('Layout is personalized.', MessageType.Update, 3000, true, false);
        this.router.navigate(['../', layout.id], { relativeTo: this.route });
      });
  }

  restore() {
    const dialogRef = this.layoutUtilsService.confirmElement('Restore layout', 'Are you sure you want to restore to default?', 'Layout is restoring...', 'Restore');
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.layoutService.restore(this.layoutId)
          .subscribe(() => {
            this.layoutUtilsService.showActionNotification('Layout is restored.', MessageType.Update, 3000, true, false);
            this.router.navigate(['../'], { relativeTo: this.route });
          });
      });
  }
}
