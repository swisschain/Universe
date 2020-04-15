import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PartialsModule } from '../views/partials/partials.module';
import { EffectsModule } from '@ngrx/effects';
import { HttpUtilsService, TypesUtilsService, LayoutUtilsService } from '../core/_base/crud';
import { ActionNotificationComponent, DeleteEntityDialogComponent, FetchEntityDialogComponent, UpdateStatusDialogComponent } from '../views/partials/content/crud';
import { ModuleGuard } from '../core/auth';
import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatSelectModule,
  MatMenuModule,
  MatProgressBarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatTabsModule,
  MatNativeDateModule,
  MatCardModule,
  MatRadioModule,
  MatIconModule,
  MatDatepickerModule,
  MatAutocompleteModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';

import { ClipboardModule } from 'ngx-clipboard';

import { AuthHeaderInterceptor } from '../core/interceptors/auth-header-interceptor';

import { ProfileRoutingModule } from './profile-routing.module';

import { AccountComponent } from './accounts/account/account.component';
import { SubscriptionListComponent } from './subscriptions/subscription-list/subscription-list.component';
import { SubscriptionEditDialogComponent } from './subscriptions/subscription-edit/subscription-edit.dialog.component';

import { SubscriptionDetailsComponent } from './subscriptions/subscription-details/subscription-details.component';
import { SubscriptionParticipantListComponent } from './subscriptions/subscription-participant-list/subscription-participant-list.component';
import { SubscriptionParticipantAddDialogComponent } from './subscriptions/subscription-participant-add/subscription-participant-add.dialog.component';

import { SubscriptionsService } from './api/subscriptions.service';
import { UsersService } from './api/users.service';

@NgModule({
  declarations: [
    AccountComponent,
    SubscriptionListComponent,
    SubscriptionEditDialogComponent,
    SubscriptionDetailsComponent,
    SubscriptionParticipantListComponent,
    SubscriptionParticipantAddDialogComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,

    MatDialogModule,
    CommonModule,
    HttpClientModule,
    PartialsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatIconModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,

    ClipboardModule
  ],
  providers: [
    ModuleGuard,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        panelClass: 'kt-mat-dialog-container__wrapper',
        height: 'auto',
        width: '900px'
      }
    },
    TypesUtilsService,
    HttpUtilsService,
    TypesUtilsService,
    LayoutUtilsService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthHeaderInterceptor, multi: true },

    SubscriptionsService,
    UsersService
  ],
  entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,

    SubscriptionEditDialogComponent,
    SubscriptionParticipantAddDialogComponent
  ]
})
export class ProfileModule { }
