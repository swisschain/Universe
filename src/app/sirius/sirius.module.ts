import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SiriusRoutingModule } from './sirius-routing.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    SiriusRoutingModule
  ]
})
export class SiriusModule { }
