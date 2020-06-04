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

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { ClipboardModule } from 'ngx-clipboard';

import { AuthHeaderInterceptor } from '../core/interceptors/auth-header-interceptor';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SiriusRoutingModule } from './sirius-routing.module';
import { BrokerAccountListComponent } from './brokerage/broker-account-list/broker-account-list.component';
import { BrokerAccountEditDialogComponent } from './brokerage/broker-account-edit/broker-account-edit.dialog.component';
import { AccountListComponent } from './brokerage/account-list/account-list.component';
import { AccountEditDialogComponent } from './brokerage/account-edit/account-edit.dialog.component';
import { AccountDetailsComponent } from './brokerage/account-details/account-details.component';
import { AccountRequisitesListComponent } from './brokerage/account-requisites-list/account-requisites-list.component';
import { BrokerAccountDetailsComponent } from './brokerage/broker-account-details/broker-account-details.component';
import { BrokerAccountRequisitesComponent } from './brokerage/broker-account-requisites/broker-account-requisites.component';
import { WorkingOnItComponent } from './shared/working-on-it/working-on-it.component';
import { BrokerAccountBalancesComponent } from './brokerage/broker-account-balances/broker-account-balances.component';
import { DepositListComponent } from './brokerage/deposit-list/deposit-list.component';
import { DepositDetailsComponent } from './brokerage/deposit-details/deposit-details.component';
import { WithdrawalListComponent } from './brokerage/withdrawal-list/withdrawal-list.component';
import { WithdrawalEditDialogComponent } from './brokerage/withdrawal-edit/withdrawal-edit.dialog.component';
import { WithdrawalDetailsComponent } from './brokerage/withdrawal-details/withdrawal-details.component';
import { RequisitesDialogComponent } from './shared/requisites/requisites.dialog.component';

import {
	AccountService,
	AssetsService,
	BlockchainsService,
	BrokerAccountService,
	DepositsService,
	KeyKeeperService,
	KeyKeepingConfigurationService,	
	VaultService,
	WithdrawalService
} from './api/services';

import { NumberDirective } from './shared/numbers-only.directive';
import { VaultListComponent } from './vaults/vault-list/vault-list.component';
import { ApiKeyEditDialogComponent } from './vaults/api-key-edit/api-key-edit.dialog.component';
import { ApiKeyListComponent } from './vaults/api-key-list/api-key-list.component';
import { VaultEditDialogComponent } from './vaults/vault-edit/vault-edit.dialog.component';
import { ApiKeyTokenDialogComponent } from './vaults/api-key-token/api-key-token.dialog.component';
import { ApiKeyRevokedComponent } from './vaults/api-key-revoked/api-key-revoked.component';
import { ApiKeyActiveComponent } from './vaults/api-key-active/api-key-active.component';
import { KeyKeeperListComponent } from './key-keepers/key-keeper-list/key-keeper-list.component';
import { KeyKeeperEditDialogComponent } from './key-keepers/key-keeper-edit/key-keeper-edit.dialog.component';
import { KeyKeepingConfigurationComponent } from './key-keepers/key-keeping-configuration/key-keeping-configuration.component';


@NgModule({
	declarations: [
		DashboardComponent,
		BrokerAccountListComponent,
		BrokerAccountEditDialogComponent,
		AccountListComponent,
		AccountEditDialogComponent,
		AccountDetailsComponent,
		AccountRequisitesListComponent,
		BrokerAccountDetailsComponent,
		BrokerAccountRequisitesComponent,
		WorkingOnItComponent,
		BrokerAccountBalancesComponent,
		DepositListComponent,
		DepositDetailsComponent,
		WithdrawalListComponent,
		WithdrawalEditDialogComponent,
		WithdrawalDetailsComponent,
		RequisitesDialogComponent,

		NumberDirective,

		VaultListComponent,
		VaultEditDialogComponent,
		ApiKeyListComponent,
		ApiKeyEditDialogComponent,
		ApiKeyTokenDialogComponent,
		ApiKeyRevokedComponent,
		ApiKeyActiveComponent,
		KeyKeeperListComponent,
		KeyKeeperEditDialogComponent,
		KeyKeepingConfigurationComponent
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

		NgxMatSelectSearchModule,

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
		DepositsService,
		KeyKeeperService,
		KeyKeepingConfigurationService,
		VaultService,
		WithdrawalService
	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,

		AccountEditDialogComponent,
		BrokerAccountEditDialogComponent,
		WithdrawalEditDialogComponent,
		RequisitesDialogComponent,
		VaultEditDialogComponent,
		ApiKeyEditDialogComponent,
		ApiKeyTokenDialogComponent,
		KeyKeeperEditDialogComponent
	]
})
export class SiriusModule { }
