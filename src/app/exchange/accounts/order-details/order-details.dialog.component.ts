import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Order } from '../../api/models/orders/order.interface';

@Component({
  selector: 'kt-order-details-dialog',
  templateUrl: './order-details.dialog.component.html',
  styleUrls: ['./order-details.dialog.component.scss']
})
export class OrderDetailsDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<OrderDetailsDialogComponent>) {
  }

  order: Order;

  ngOnInit() {
    this.order = this.data.order;
  }
}
