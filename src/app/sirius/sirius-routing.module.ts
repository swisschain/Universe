import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountListComponent } from './brokerage/account-list/account-list.component';
import { AccountDetailsComponent } from './brokerage/account-details/account-details.component';
import { BrokerAccountListComponent } from './brokerage/broker-account-list/broker-account-list.component';
import { BrokerAccountDetailsComponent } from './brokerage/broker-account-details/broker-account-details.component';
import { DepositListComponent } from './brokerage/deposit-list/deposit-list.component';

import { WorkingOnItComponent } from './shared/working-on-it/working-on-it.component';
import { DepositDetailsComponent } from './brokerage/deposit-details/deposit-details.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'brakerage/broker-accounts',
        component: BrokerAccountListComponent
    },
    {
        path: 'brakerage/broker-accounts/:brokerAccountId',
        component: BrokerAccountDetailsComponent
    },
    {
        path: 'brakerage/accounts',
        component: AccountListComponent
    },
    {
        path: 'brakerage/accounts/:accountId',
        component: AccountDetailsComponent
    },
    {
        path: 'brakerage/deposits',
        component: DepositListComponent
    },
    {
        path: 'brakerage/deposits/:depositId',
        component: DepositDetailsComponent
    },
    {
        path: '',
        redirectTo: 'dashboard',
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
export class SiriusRoutingModule { }