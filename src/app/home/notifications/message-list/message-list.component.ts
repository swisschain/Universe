import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Subscription, fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { getProductTitle, getChannelTitle, getMessageStatusTitle } from '../enum-name.util';

import { Message, Product, Channel, MessageStatus } from '../../api/models/notifications';
import { MessageService } from '../../api/services';
import { MessageDataSource } from '../../data-sources';
import { MessageDetailsDialogComponent } from '../message-details/message-details.dialog.component';

@Component({
  selector: 'kt-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit, OnDestroy {

  @ViewChild('searchByTemplateNameInput', { static: true }) searchByTemplateNameInput: ElementRef;
  @ViewChild('searchByAddressInput', { static: true }) searchByAddressInput: ElementRef;

  constructor(
    public dialog: MatDialog,
    private messageService: MessageService) { }

  private subscriptions: Subscription[] = [];

  private templateName = '';
  private address = '';

  status: MessageStatus = null;
  channel: Channel = null;
  product: Product = null;

  dataSource: MessageDataSource;
  displayedColumns = ['product', 'channel', 'templateName', 'status', 'address', 'created', 'sent', 'actions'];

  ngOnInit() {
    this.dataSource = new MessageDataSource(this.messageService);

    const searchByTemplateNameSubscription = fromEvent(this.searchByTemplateNameInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.templateName = value;
        this.load();
      });

    this.subscriptions.push(searchByTemplateNameSubscription);

    const searchByAddressSubscription = fromEvent(this.searchByAddressInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.address = value;
        this.load();
      });

    this.subscriptions.push(searchByAddressSubscription);

    this.load();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load(this.product, this.channel, this.status, this.templateName, this.address);
  }

  getProductTitle(product: Product): string {
    return getProductTitle(product);
  }

  getChannelTitle(channel: Channel): string {
    return getChannelTitle(channel);
  }

  getMessageStatusTitle(messageStatus: MessageStatus): string {
    return getMessageStatusTitle(messageStatus);
  }

  details(message: Message) {
    this.dialog.open(MessageDetailsDialogComponent, { data: { message }, width: '800px' });
  }
}
