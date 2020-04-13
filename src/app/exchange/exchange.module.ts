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
import { ExchangeRoutingModule } from './exchange-routing.module';
import { AssetsService } from './api/assets.service';
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

import { WorkingOnItComponent } from './shared/working-on-it/working-on-it.component';

import { AccountsService } from './api/accounts.service';
import { AssetPairsService } from './api/asset-pairs.service';
import { OrderBooksService } from './api/order-books.service';
import { LimitOrdersService } from './api/limit-orders.service';
import { AccountListComponent } from './accounts/account-list/account-list.component';
import { AccountDetailsComponent } from './accounts/account-details/account-details.component';
import { AccountEditDialogComponent } from './accounts/account-edit/account-edit.dialog.component';
import { AccountBalanceListComponent } from './accounts/account-balance-list/account-balance-list.component';
import { AccountBalanceHistoryListComponent } from './accounts/account-balance-history-list/account-balance-history-list.component';
import { AccountOrderListComponent } from './accounts/account-order-list/account-order-list.component';
import { AccountTradeListComponent } from './accounts/account-trade-list/account-trade-list.component';

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
		AccountTradeListComponent
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

		AccountsService,
		AssetsService,
		AssetPairsService,
		OrderBooksService,
		LimitOrdersService
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
		AccountEditDialogComponent
	]
})
export class ExchangeModule { }
