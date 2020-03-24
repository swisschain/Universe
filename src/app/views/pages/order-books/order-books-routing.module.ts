import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { OrderBookListComponent } from './order-book-list/order-book-list.component';
import { OrderBookDetailsComponent } from './order-book-details/order-book-details.component';


const routes: Routes = [
    {
        path: 'list',
        component: OrderBookListComponent
    },
    {
        path: 'details/:assetPairId',
        component: OrderBookDetailsComponent
    },
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    }
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrderBooksRoutingModule {}