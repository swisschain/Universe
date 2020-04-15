import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';
import { ActivatedRoute } from '@angular/router';

import { SubscriptionsService } from '../../api/subscriptions.service';
import { ParticipantsDataSource } from '../../models/participants-data-source';
import { Participant } from '../../api/models/subscriptions/participant.interface';
import { SubscriptionParticipantAddDialogComponent } from '../subscription-participant-add/subscription-participant-add.dialog.component';

@Component({
  selector: 'kt-subscription-participant-list',
  templateUrl: './subscription-participant-list.component.html',
  styleUrls: ['./subscription-participant-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionParticipantListComponent implements OnInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private subscriptionsService: SubscriptionsService) { }

  private subscriptions: Subscription[] = [];
  private subscriptionId: string;

  dataSource: ParticipantsDataSource;
  displayedColumns = ['name', 'email', 'role', 'actions'];

  ngOnInit() {
    this.dataSource = new ParticipantsDataSource(this.subscriptionsService);

    const routeSubscription = this.route.params.subscribe(params => {
      this.subscriptionId = params['subscriptionId'];
      this.load();
    });

    this.subscriptions.push(routeSubscription);

    this.load();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load(this.subscriptionId);
  }

  add() {
    const saveMessage = 'Participant added';
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(SubscriptionParticipantAddDialogComponent, { data: { subscriptionId: this.subscriptionId }, width: '500px' });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this.layoutUtilsService.showActionNotification(saveMessage, messageType, 1000, true, false);
      this.load();
    });
  }

  delete(participant: Participant) {
    const dialogRef = this.layoutUtilsService.deleteElement('Participant Remove', 'Are you sure to remove participant from subscription?', 'Participant is removing...');
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.subscriptionsService.deleteParticipant(this.subscriptionId, participant.userId)
          .subscribe(
            response => {
              this.layoutUtilsService.showActionNotification('Participant has been removed.', MessageType.Delete, 3000, true, false);
              this.load();
            },
            error => {
              this.layoutUtilsService.showActionNotification('An error occurred while removing participant.', MessageType.Update, 3000, true, false);
            }
          );
      });
  }
}
