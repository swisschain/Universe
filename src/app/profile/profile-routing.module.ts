import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AccountComponent } from './accounts/account/account.component';
import { SubscriptionListComponent } from './subscriptions/subscription-list/subscription-list.component';
import { SubscriptionDetailsComponent } from './subscriptions/subscription-details/subscription-details.component';

const routes: Routes = [
    {
        path: 'account',
        component: AccountComponent
    },
    {
        path: 'subscriptions',
        component: SubscriptionListComponent
    },
    {
        path: 'subscriptions/:subscriptionId',
        component: SubscriptionDetailsComponent
    },
    {
        path: '',
        redirectTo: 'account',
        pathMatch: 'full'
    },
    { path: '**', redirectTo: 'comming-soon', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }