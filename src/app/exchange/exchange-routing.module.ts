import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { DashboardComponent } from './dashboard/dashboard.component';
import { InstrumentsComponent } from './instruments/instruments/instruments.component';
import { WorkingOnItComponent } from './shared/working-on-it/working-on-it.component';

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