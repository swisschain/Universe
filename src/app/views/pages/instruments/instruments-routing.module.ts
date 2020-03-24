import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AssetsListComponent } from './assets-list/assets-list.component';
import { AssetPairsListComponent } from './asset-pairs-list/asset-pairs-list.component';

const routes: Routes = [
    {
        path: 'assets',
        component: AssetsListComponent
    },
    {
        path: 'asset-pairs',
        component: AssetPairsListComponent
    },
    {
        path: '',
        redirectTo: 'assets',
        pathMatch: 'full'
    }
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InstrumentsRoutingModule {}