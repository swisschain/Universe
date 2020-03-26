import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExchangeRoutingModule } from './exchange-routing.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    ExchangeRoutingModule
  ]
})
export class ExchangeModule { }
