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
import { SiriusRoutingModule } from './sirius-routing.module';
import { BrokerAccountListComponent } from './brokerage/broker-account-list/broker-account-list.component';
import { BrokerAccountEditDialogComponent } from './brokerage/broker-account-edit/broker-account-edit.dialog.component';
import { AccountListComponent } from './brokerage/account-list/account-list.component';
import { AccountEditDialogComponent } from './brokerage/account-edit/account-edit.dialog.component';

import { AccountService } from './api/account.service';
import { BrokerAccountService } from './api/broker-account.service';
import { AccountDetailsComponent } from './brokerage/account-details/account-details.component';
import { AssetsService } from './api/assets.service';
import { BlockchainsService } from './api/blockchains.service';
import { AccountRequisitesListComponent } from './brokerage/account-requisites-list/account-requisites-list.component';
import { AssetsListComponent } from './shared/assets-list/assets-list.component';
import { AssetRequisitesDialogComponent } from './shared/asset-requisites/asset-requisites.dialog.component';
import { BrokerAccountDetailsComponent } from './brokerage/broker-account-details/broker-account-details.component';
import { BrokerAccountRequisitesComponent } from './brokerage/broker-account-requisites/broker-account-requisites.component';
import { WorkingOnItComponent } from './shared/working-on-it/working-on-it.component';
import { BrokerAccountBalancesComponent } from './brokerage/broker-account-balances/broker-account-balances.component';
import { DepositListComponent } from './brokerage/deposit-list/deposit-list.component';
import { DepositsService } from './api/deposits.service';

import { NumberDirective } from './shared/numbers-only.directive';
import { DepositDetailsComponent } from './brokerage/deposit-details/deposit-details.component';

@NgModule({
	declarations: [
		DashboardComponent,
		BrokerAccountListComponent,
		BrokerAccountEditDialogComponent,
		AccountListComponent,
		AccountEditDialogComponent,
		AccountDetailsComponent,
		AccountRequisitesListComponent,
		AssetsListComponent,
		AssetRequisitesDialogComponent,
		BrokerAccountDetailsComponent,
		BrokerAccountRequisitesComponent,
		WorkingOnItComponent,
		BrokerAccountBalancesComponent,
		DepositListComponent,
		NumberDirective,
		DepositDetailsComponent
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

		AccountService,
		AssetsService,
		BlockchainsService,
		BrokerAccountService,
		DepositsService
	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,

		AccountEditDialogComponent,
		BrokerAccountEditDialogComponent,
		AssetRequisitesDialogComponent
	]
})
export class SiriusModule { }
