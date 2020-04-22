import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Blockchain } from '../../api/models/blockchains/blockchain.interface';

@Component({
  selector: 'kt-requisites-dialog',
  templateUrl: './requisites.dialog.component.html',
  styleUrls: ['./requisites.dialog.component.scss']
})
export class RequisitesDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  loading = true;
  viewLoading = false;

  blockchain: Blockchain;
  address = '';
  tagLable = 'Tag';
  tagTypeLable = 'Tag Type';
  tag = '';
  tagType = '';

  ngOnInit() {
    this.address = this.data.address;
    this.blockchain = this.data.blockchain;
    this.tag = this.data.tag ? this.data.tag : '';
    this.tagType = this.data.tagType ? this.data.tagType : '';
  }
}
