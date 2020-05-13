import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { DashboardComponent } from './dashboard/dashboard.component';
import { InstrumentsComponent } from './instruments/instruments/instruments.component';
import { WorkingOnItComponent } from './shared/working-on-it/working-on-it.component';
import { OrderBookListComponent } from './trading/order-book-list/order-book-list.component';
import { OrderBookDetailsComponent } from './trading/order-book-details/order-book-details.component';
import { AccountListComponent } from './accounts/account-list/account-list.component';
import { AccountDetailsComponent } from './accounts/account-details/account-details.component';
import { TradingFeeListComponent } from './fees/trading-fee-list/trading-fee-list.component';
import { CashOperationsFeeListComponent } from './fees/cash-operations-fee-list/cash-operations-fee-list.component';
import { TradingFeeLevelListComponent } from './fees/trading-fee-level-list/trading-fee-level-list.component';
import { AuditComponent } from './fees/audit/audit.component';
import { SettingsComponent } from './fees/settings/settings.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'management/instruments',
        component: InstrumentsComponent
    },
    {
        path: 'management/accounts',
        component: AccountListComponent
    },
    {
        path: 'management/accounts/:accountId',
        component: AccountDetailsComponent
    },
    {
        path: 'fees/cash-operations',
        component: CashOperationsFeeListComponent
    },
    {
        path: 'fees/trading',
        component: TradingFeeListComponent
    },
    {
        path: 'fees/trading/:tradingFeeId',
        component: TradingFeeLevelListComponent
    },
    {
        path: 'fees/audit',
        component: AuditComponent
    },
    {
        path: 'fees/settings',
        component: SettingsComponent
    },
    {
        path: 'trading/order-books',
        component: OrderBookListComponent
    },
    {
        path: 'trading/order-books/:symbol',
        component: OrderBookDetailsComponent
    },
    {
        path: '',
        redirectTo: 'management/instruments',
        pathMatch: 'full'
    },
    {
        path: 'comming-soon',
        component: WorkingOnItComponent
    },
    { path: '**', redirectTo: 'comming-soon', pathMatch: 'full' },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class ExchangeRoutingModule { }