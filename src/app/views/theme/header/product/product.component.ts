import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'kt-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef) { }

  root = false;
  beta = false;
  title: string;
  currentRouteUrl: string;

  ngOnInit() {
    this.update();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.update();
      });
  }

  private update(): void {
    const currentRouteUrl = this.router.url.split(/[?#]/)[0];

    console.log(currentRouteUrl);
    if (this.currentRouteUrl === currentRouteUrl) {
      return;
    }

    this.currentRouteUrl = currentRouteUrl;
    this.root = false;
    this.beta = false;
    if (this.currentRouteUrl.indexOf('/home/') !== -1) {
      this.root = true;
      this.title = 'Universe';
    } else if (this.currentRouteUrl.indexOf('/profile/') !== -1) {
      this.title = 'Account';
    } else if (this.currentRouteUrl.indexOf('/exchange/') !== -1) {
      this.title = 'Antares';
    } else if (this.currentRouteUrl.indexOf('/sirius/') !== -1) {
      this.title = 'Sirius';
      this.beta = true;
    }

    this.cdr.markForCheck();
  }
}
