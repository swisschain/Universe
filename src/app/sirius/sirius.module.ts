import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PartialsModule } from '../views/partials/partials.module';
import { EffectsModule } from '@ngrx/effects';
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService } from '../core/_base/crud';
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

import { DashboardComponent } from './dashboard/dashboard.component';
import { SiriusRoutingModule } from './sirius-routing.module';
import { BrokerAccountListComponent } from './brokerage/broker-account-list/broker-account-list.component';
import { ApiUrlInterceptor } from '../core/interceptors/api-url-interceptor';
import { AuthHeaderInterceptor } from '../core/interceptors/auth-header-interceptor';
import { BrokerAccountEditDialogComponent } from './brokerage/broker-account-edit/broker-account-edit.dialog.component';

@NgModule({
  declarations: [
    DashboardComponent,
    BrokerAccountListComponent,
    BrokerAccountEditDialogComponent
  ],
  imports: [
    CommonModule,
    SiriusRoutingModule,

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
		MatTooltipModule
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
		{ provide: HTTP_INTERCEPTORS, useClass: ApiUrlInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: AuthHeaderInterceptor, multi: true }
  ],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,

		BrokerAccountEditDialogComponent
	]
})
export class SiriusModule { }
