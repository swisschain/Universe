import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PartialsModule } from '../views/partials/partials.module';
import { EffectsModule } from '@ngrx/effects';
import { HttpUtilsService, TypesUtilsService, LayoutUtilsService } from '../core/_base/crud';
import { ActionNotificationComponent, DeleteEntityDialogComponent, FetchEntityDialogComponent, UpdateStatusDialogComponent, EntityDialogComponent } from '../views/partials/content/crud';
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

import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeRoutingModule } from './home-routing.module';
import { WorkingOnItComponent } from './shared/working-on-it/working-on-it.component';
import { ApiKeyListComponent } from './api-keys/api-key-list/api-key-list.component';
import { ApiKeyEditDialogComponent } from './api-keys/api-key-edit/api-key-edit.dialog.component';
import { ApiKeyTokenDialogComponent } from './api-keys/api-key-token/api-key-token.dialog.component';
import { ApiKeysComponent } from './api-keys/api-keys/api-keys.component';
import { ApiKeyDeletedListComponent } from './api-keys/api-key-deleted-list/api-key-deleted-list.component';

import { ApiKeyService, LayoutService, MessageService, NotificationApiKeyService, ProviderService, TemplateService } from './api/services';
import { LayoutListComponent } from './notifications/layout-list/layout-list.component';
import { LayoutContentListComponent } from './notifications/layout-content-list/layout-content-list.component';
import { LayoutContentEditComponent } from './notifications/layout-content-edit/layout-content-edit.component';
import { TemplateListComponent } from './notifications/template-list/template-list.component';
import { TemplateContentListComponent } from './notifications/template-content-list/template-content-list.component';
import { TemplateContentEditDialogComponent } from './notifications/template-content-edit/template-content-edit.dialog.component';
import { TemplateContentEmailEditComponent } from './notifications/template-content-email-edit/template-content-email-edit.component';
import { TemplateComponent } from './notifications/template/template.component';
import { LayoutComponent } from './notifications/layout/layout.component';
import { MessageListComponent } from './notifications/message-list/message-list.component';
import { MessageDetailsDialogComponent } from './notifications/message-details/message-details.dialog.component';
import { NotificationApiKeyListComponent } from './notifications/api-key-list/api-key-list.component';
import { NotificationApiKeyEditDialogComponent } from './notifications/api-key-edit/api-key-edit.dialog.component';

@NgModule({
  declarations: [
    DashboardComponent,
    WorkingOnItComponent,
    ApiKeyListComponent,
    ApiKeyEditDialogComponent,
    ApiKeyTokenDialogComponent,
    ApiKeysComponent,
    ApiKeyDeletedListComponent,
    LayoutListComponent,
    LayoutContentListComponent,
    LayoutContentEditComponent,
    TemplateListComponent,
    TemplateContentListComponent,
    TemplateContentEditDialogComponent,
    TemplateContentEmailEditComponent,
    TemplateComponent,
    LayoutComponent,
    MessageListComponent,
    MessageDetailsDialogComponent,
    NotificationApiKeyListComponent,
    NotificationApiKeyEditDialogComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,

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

    ApiKeyService,
    LayoutService,
    MessageService,
    NotificationApiKeyService,
    ProviderService,
    TemplateService
  ],
  entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
    EntityDialogComponent,

    ApiKeyEditDialogComponent,
    ApiKeyTokenDialogComponent,
    TemplateContentEditDialogComponent,
    MessageDetailsDialogComponent,
    NotificationApiKeyEditDialogComponent
  ]
})
export class HomeModule { }
