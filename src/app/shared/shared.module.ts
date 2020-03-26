import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './views/layout/layout.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './views/footer/footer.component';

@NgModule({
  declarations: [
    LayoutComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    LayoutComponent,
    FooterComponent
  ],
  providers: [

  ]
})
export class SharedModule { }
