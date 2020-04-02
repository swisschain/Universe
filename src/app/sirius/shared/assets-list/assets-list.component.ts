import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

import { Asset } from '../../api/models/assets/asset.interface';
import { AssetsService } from '../../api/assets.service';
import { Blockchain } from '../../api/models/blockchains/blockchain.interface';
import { BlockchainsService } from '../../api/blockchains.service';

import { AssetsDataSource } from '../../models/assets-data-source';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'kt-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetsListComponent implements OnInit, OnDestroy {

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @Output() assetSelected = new EventEmitter<Asset>();

  constructor(
    private assetsService: AssetsService,
    private blockchainsService: BlockchainsService) { }

  private subscriptions: Subscription[] = [];
  private searchValue = '';

  dataSource: AssetsDataSource;
  displayedColumns = ['id', 'symbol', 'blockchainName', 'address', 'accuracy', 'actions'];

  blockchainId: string = '';
  blockchains: Blockchain[];

  ngOnInit() {
    this.dataSource = new AssetsDataSource(this.assetsService);

    const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.searchValue = value;
        this.load();
      });

    this.subscriptions.push(searchSubscription);

    this.blockchainsService.get()
      .subscribe(response => {
        this.blockchains = response.items;
        this.load();
      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load(this.searchValue, this.blockchainId);
  }

  select(asset: Asset) {
    this.assetSelected.emit(asset);
  }
}
