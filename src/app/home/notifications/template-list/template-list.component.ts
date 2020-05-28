import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { getProductTitle } from '../enum-name.util';

import { Product } from '../../api/models/notifications';
import { TemplateService } from '../../api/services';
import { TemplateDataSource } from '../../data-sources';


@Component({
  selector: 'kt-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent implements OnInit, OnDestroy {

  constructor(
    private templateService: TemplateService) { }

  private subscriptions: Subscription[] = [];
  searchByNameInput = new FormControl();

  dataSource: TemplateDataSource;
  displayedColumns = ['name', 'product', 'isPersonalized', 'created', 'modified', 'actions'];

  name: string = '';
  product: Product = null;

  ngOnInit() {
    this.dataSource = new TemplateDataSource(this.templateService);

    const searchByAssetSubscription = this.searchByNameInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.name = value;
        this.load();
      });
    this.subscriptions.push(searchByAssetSubscription);

    this.load();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load(this.name, this.product);
  }

  getProductTitle(product: Product): string {
    return getProductTitle(product);
  }
}
