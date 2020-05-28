import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { getProductTitle } from '../enum-name.util';

import { Product } from '../../api/models/notifications';
import { LayoutService } from '../../api/services';
import { LayoutDataSource } from '../../data-sources';

@Component({
  selector: 'kt-layout-list',
  templateUrl: './layout-list.component.html',
  styleUrls: ['./layout-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutListComponent implements OnInit {

  constructor(
    private layoutService: LayoutService) { }

  dataSource: LayoutDataSource;
  displayedColumns = ['product', 'isPersonalized', 'created', 'modified', 'actions'];

  product: Product = null;

  ngOnInit() {
    this.dataSource = new LayoutDataSource(this.layoutService);
    this.load();
  }

  load() {
    this.dataSource.load(this.product);
  }

  getProductTitle(product: Product): string {
    return getProductTitle(product);
  }
}
