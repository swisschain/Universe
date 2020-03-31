import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrokerAccountService } from './api/broker-account.service';

import { DashboardComponent } from './dashboard/dashboard.component';
import { BrokerAccountListComponent } from './brokerage/broker-account-list/broker-account-list.component';

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
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        BrokerAccountService
    ]
})
export class SiriusRoutingModule { }