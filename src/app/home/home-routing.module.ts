import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { DashboardComponent } from './dashboard/dashboard.component';
import { WorkingOnItComponent } from './shared/working-on-it/working-on-it.component';
import { ApiKeysComponent } from './api-keys/api-keys/api-keys.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'api-keys',
        component: ApiKeysComponent
    },
    {
        path: 'comming-soon',
        component: WorkingOnItComponent
    },
    {
        path: '',
        redirectTo: 'api-keys',
        pathMatch: 'full'
    },
    {
        path: 'comming-soon',
        component: WorkingOnItComponent
    },
    { path: '**', redirectTo: 'comming-soon', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }