import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';
import { SubscriptionsDataSource } from '../../models/subscriptions-data-source';
import { SubscriptionsService } from '../../api/subscriptions.service';
import { Subscription as UserSubscription } from '../../api/models/subscriptions/subscription.interface'
import { SubscriptionEditDialogComponent } from '../subscription-edit/subscription-edit.dialog.component';
import { UsersService } from '../../api/users.service';

@Component({
  selector: 'kt-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionListComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router,
    private layoutUtilsService: LayoutUtilsService,
    private subscriptionsService: SubscriptionsService,
    private usersService: UsersService) { }

  private subscriptions: Subscription[] = [];

  currentSubscriptionId: '';
  dataSource: SubscriptionsDataSource;
  displayedColumns = ['name', 'description', 'active', 'created', 'modified', 'actions'];

  ngOnInit() {
    this.dataSource = new SubscriptionsDataSource(this.subscriptionsService);
    this.load();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.currentSubscriptionId = this.subscriptionsService.getCurrentSubscriptionId();
    this.dataSource.load();
  }

  add() {
    const subscription: UserSubscription = {
      id: null,
      name: null,
      description: null,
      created: null,
      modified: null
    };

    this.edit(subscription);
  }

  edit(subscription: UserSubscription) {
    const saveMessage = subscription.id ? 'Subscription updated' : 'Subscription added';
    const messageType = subscription.id ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(SubscriptionEditDialogComponent, { data: { subscription }, width: '500px' });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(saveMessage, messageType, 1000, true, false);
      this.load();
    });
  }

  delete(subscription: UserSubscription) {
    const dialogRef = this.layoutUtilsService.deleteElement('Subscription Delete', 'Are you sure to permanently delete this subscription?', 'Subscription is deleting...');
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.subscriptionsService.delete(subscription.id)
          .subscribe(
            response => {
              this.layoutUtilsService.showActionNotification('Subscription has been deleted.', MessageType.Delete, 3000, true, false);

              if (subscription.id == this.currentSubscriptionId) {
                this.usersService.updateToken()
                  .subscribe(
                    result => {
                      this.load();
                    }
                  );
              }
              else {
                this.load();
              }
            },
            error => {
              this.layoutUtilsService.showActionNotification('An error occurred while deleting subscription.', MessageType.Update, 3000, true, false);
            }
          );
      });
  }

  activate(subscription: UserSubscription) {
    this.usersService.switchSubscription(subscription.id)
      .subscribe(
        response => {
          this.usersService.updateToken()
            .subscribe(
              result => {
                this.layoutUtilsService.showActionNotification('Subscription has been activated.', MessageType.Delete, 3000, true, false);
                this.router.navigateByUrl('/home/dashboard');
              }
            );
        },
        error => {
          this.layoutUtilsService.showActionNotification('An error occurred while activating subscription.', MessageType.Update, 3000, true, false);
        }
      );
  }
}
