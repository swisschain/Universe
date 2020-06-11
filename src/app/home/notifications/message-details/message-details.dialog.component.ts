import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { getProductTitle, getChannelTitle, getMessageStatusTitle } from '../enum-name.util';

import { Message, MessageStatus, Channel, Product } from '../../api/models/notifications';

@Component({
  selector: 'kt-message-details-dialog',
  templateUrl: './message-details.dialog.component.html',
  styleUrls: ['./message-details.dialog.component.scss']
})
export class MessageDetailsDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MessageDetailsDialogComponent>) { }

  message: Message;

  ngOnInit() {
    this.message = this.data.message;
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
}
