import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { formatAddress } from '../../shared/address-utils';

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

  blockchainName = '';
  address = '';
  tagLable = 'Tag';
  tagTypeLable = 'Tag Type';
  tag = '';
  tagType = '';

  ngOnInit() {
    this.address = formatAddress(this.data.address);
    this.blockchainName = this.data.blockchain.name;
    this.tag = this.data.tag ? this.data.tag : '';
    this.tagLable = this.data.tagLable ? this.data.tagLable : '';
    this.tagType = this.data.tagType ? this.data.tagType : '';
  }
}
