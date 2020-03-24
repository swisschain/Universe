import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AssetsService } from './services/assets.service';
import { AssetPairsService } from './services/asset-pairs.service';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptService } from '../core/_base/crud';
import { BalancesService } from './services/balances.service';
import { OrderBooksService } from './services/order-books.service';
import { LimitOrdersService } from './services/limit-orders.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers:[
    AssetsService,
    AssetPairsService,
    BalancesService,
    OrderBooksService,
    LimitOrdersService,
    InterceptService,
	 	{
	 		provide: HTTP_INTERCEPTORS,
	 		useClass: InterceptService,
	 		multi: true
	 	}
  ]
})
export class ApiModule { }
