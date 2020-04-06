import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { DashboardComponent } from './dashboard/dashboard.component';
import { InstrumentsComponent } from './instruments/instruments/instruments.component';
import { WorkingOnItComponent } from './shared/working-on-it/working-on-it.component';
import { OrderBookListComponent } from './trading/order-book-list/order-book-list.component';
import { OrderBookDetailsComponent } from './trading/order-book-details/order-book-details.component';

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
        path: 'trading/order-books',
        component: OrderBookListComponent
    },
    {
        path: 'trading/order-books/:assetPairId',
        component: OrderBookDetailsComponent
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
export class ExchangeRoutingModule { }