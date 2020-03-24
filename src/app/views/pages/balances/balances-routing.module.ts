import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { BalancesListComponent } from './balances-list/balances-list.component';

const routes: Routes = [
    {
        path: 'accounts',
        component: BalancesListComponent
    },
    {
        path: '',
        redirectTo: 'accounts',
        pathMatch: 'full'
    }
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BalancesRoutingModule {}