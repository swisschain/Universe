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
import { WithdrawalListComponent } from './brokerage/withdrawal-list/withdrawal-list.component';
import { WithdrawalDetailsComponent } from './brokerage/withdrawal-details/withdrawal-details.component';
import { VaultListComponent } from './vaults/vault-list/vault-list.component';
import { ApiKeyListComponent } from './vaults/api-key-list/api-key-list.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'brokerage/broker-accounts',
        component: BrokerAccountListComponent
    },
    {
        path: 'brokerage/broker-accounts/:brokerAccountId',
        component: BrokerAccountDetailsComponent
    },
    {
        path: 'brokerage/accounts',
        component: AccountListComponent
    },
    {
        path: 'brokerage/accounts/:accountId',
        component: AccountDetailsComponent
    },
    {
        path: 'brokerage/deposits',
        component: DepositListComponent
    },
    {
        path: 'brokerage/deposits/:depositId',
        component: DepositDetailsComponent
    },
    {
        path: 'brokerage/withdrawals',
        component: WithdrawalListComponent
    },
    {
        path: 'brokerage/withdrawals/:withdrawalId',
        component: WithdrawalDetailsComponent
    },
    {
        path: 'vaults',
        component: VaultListComponent
    },
    {
        path: 'vaults/:vaultId',
        component: ApiKeyListComponent
    },
    {
        path: '',
        redirectTo: 'brokerage/broker-accounts',
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