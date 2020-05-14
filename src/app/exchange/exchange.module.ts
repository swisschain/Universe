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

import {
	AccountDataService,
	AccountService,
	AssetPairService,
	AssetService,
	CashOperationsFeeService,
	FeeHistoryService,
	FeeSettingsService,
	LimitOrderService,
	MarketOrderService,
	OperationsService,
	OrderBookService,
	TradingFeeService
} from './api/services';

import { WorkingOnItComponent } from './shared/working-on-it/working-on-it.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ExchangeRoutingModule } from './exchange-routing.module';
import { InstrumentsComponent } from './instruments/instruments/instruments.component';
import { AssetListComponent } from './instruments/asset-list/asset-list.component';
import { AssetEditDialogComponent } from './instruments/asset-edit/asset-edit.dialog.component';
import { AssetPairListComponent } from './instruments/asset-pair-list/asset-pair-list.component';
import { AssetPairEditDialogComponent } from './instruments/asset-pair-edit/asset-pair-edit.dialog.component';
import { AssetDetailsDialogComponent } from './instruments/asset-details/asset-details.dialog.component';
import { AssetPairDetailsDialogComponent } from './instruments/asset-pair-details/asset-pair-details.dialog.component';
import { LimitOrderEditDialogComponent } from './trading/limit-order-edit/limit-order-edit.dialog.component';
import { OrderBookListComponent } from './trading/order-book-list/order-book-list.component';
import { OrderBookDetailsComponent } from './trading/order-book-details/order-book-details.component';
import { AccountListComponent } from './accounts/account-list/account-list.component';
import { AccountDetailsComponent } from './accounts/account-details/account-details.component';
import { AccountEditDialogComponent } from './accounts/account-edit/account-edit.dialog.component';
import { AccountBalanceListComponent } from './accounts/account-balance-list/account-balance-list.component';
import { AccountBalanceHistoryListComponent } from './accounts/account-balance-history-list/account-balance-history-list.component';
import { AccountOrderListComponent } from './accounts/account-order-list/account-order-list.component';
import { AccountTradeListComponent } from './accounts/account-trade-list/account-trade-list.component';
import { MarketOrderEditDialogComponent } from './trading/market-order-edit/market-order-edit.dialog.component';
import { CashOperationsDialogComponent } from './accounts/cash-operations/cash-operations.dialog.component';
import { OrderDetailsDialogComponent } from './accounts/order-details/order-details.dialog.component';
import { CashTransferDialogComponent } from './accounts/cash-transfer/cash-transfer.dialog.component';
import { BalanceHistoryDetailsDialogComponent } from './accounts/balance-history-details/balance-history-details.dialog.component';
import { CashOperationsFeeListComponent } from './fees/cash-operations-fee-list/cash-operations-fee-list.component';
import { CashOperationsFeeEditDialogComponent } from './fees/cash-operations-fee-edit/cash-operations-fee-edit.dialog.component';
import { CashOperationsFeeComponent } from './fees/cash-operations-fee/cash-operations-fee.component';
import { CashOperationsFeeHistoryComponent } from './fees/cash-operations-fee-history/cash-operations-fee-history.component';
import { TradingFeeListComponent } from './fees/trading-fee-list/trading-fee-list.component';
import { TradingFeeEditDialogComponent } from './fees/trading-fee-edit/trading-fee-edit.dialog.component';
import { TradingFeeLevelListComponent } from './fees/trading-fee-level-list/trading-fee-level-list.component';
import { TradingFeeLevelEditDialogComponent } from './fees/trading-fee-level-edit/trading-fee-level-edit.dialog.component';
import { TradingFeeComponent } from './fees/trading-fee/trading-fee.component';
import { AuditComponent } from './fees/audit/audit.component';
import { TradingFeeHistoryComponent } from './fees/trading-fee-history/trading-fee-history.component';
import { SettingsComponent } from './fees/settings/settings.component';

@NgModule({
	declarations: [
		DashboardComponent,
		InstrumentsComponent,
		AssetListComponent,
		AssetEditDialogComponent,
		AssetPairListComponent,
		AssetPairEditDialogComponent,
		AssetDetailsDialogComponent,
		AssetPairDetailsDialogComponent,
		WorkingOnItComponent,
		OrderBookListComponent,
		OrderBookDetailsComponent,
		LimitOrderEditDialogComponent,
		AccountListComponent,
		AccountDetailsComponent,
		AccountEditDialogComponent,
		AccountBalanceListComponent,
		AccountBalanceHistoryListComponent,
		AccountOrderListComponent,
		AccountTradeListComponent,
		MarketOrderEditDialogComponent,
		CashOperationsDialogComponent,
		OrderDetailsDialogComponent,
		CashTransferDialogComponent,
		BalanceHistoryDetailsDialogComponent,
		CashOperationsFeeListComponent,
		CashOperationsFeeEditDialogComponent,
		CashOperationsFeeComponent,
		CashOperationsFeeHistoryComponent,
		TradingFeeListComponent,
		TradingFeeEditDialogComponent,
		TradingFeeLevelListComponent,
		TradingFeeLevelEditDialogComponent,
		TradingFeeComponent,
		AuditComponent,
		TradingFeeHistoryComponent,
		SettingsComponent
	],
	imports: [
		CommonModule,
		ExchangeRoutingModule,

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

		AccountDataService,
		AccountService,
		AssetPairService,
		AssetService,
		CashOperationsFeeService,
		FeeHistoryService,
		FeeSettingsService,		
		LimitOrderService,
		MarketOrderService,		
		OperationsService,
		OrderBookService,
		TradingFeeService
	],
	entryComponents: [
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,

		AssetEditDialogComponent,
		AssetDetailsDialogComponent,
		AssetPairEditDialogComponent,
		AssetPairDetailsDialogComponent,
		LimitOrderEditDialogComponent,
		AccountEditDialogComponent,
		MarketOrderEditDialogComponent,
		CashOperationsDialogComponent,
		OrderDetailsDialogComponent,
		CashTransferDialogComponent,
		BalanceHistoryDetailsDialogComponent,
		CashOperationsFeeEditDialogComponent,
		TradingFeeEditDialogComponent,
		TradingFeeLevelEditDialogComponent
	]
})
export class ExchangeModule { }
