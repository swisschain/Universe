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

import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeRoutingModule } from './home-routing.module';
import { WorkingOnItComponent } from './shared/working-on-it/working-on-it.component';
import { ApiKeyListComponent } from './api-keys/api-key-list/api-key-list.component';
import { ApiKeyEditDialogComponent } from './api-keys/api-key-edit/api-key-edit.dialog.component';
import { ApiKeyTokenDialogComponent } from './api-keys/api-key-token/api-key-token.dialog.component';
import { ApiKeyService } from './api/services/api-key.service';
import { ApiKeysComponent } from './api-keys/api-keys/api-keys.component';
import { ApiKeyDeletedListComponent } from './api-keys/api-key-deleted-list/api-key-deleted-list.component';

@NgModule({
  declarations: [
    DashboardComponent,
    WorkingOnItComponent,
    ApiKeyListComponent,
    ApiKeyEditDialogComponent,
    ApiKeyTokenDialogComponent,
    ApiKeysComponent,
    ApiKeyDeletedListComponent
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
    
    ApiKeyService
	],
  entryComponents: [
    ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
    
    ApiKeyEditDialogComponent,
    ApiKeyTokenDialogComponent
  ]
})
export class HomeModule { }
