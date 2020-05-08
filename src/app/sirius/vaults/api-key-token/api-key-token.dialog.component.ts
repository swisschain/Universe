import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ApiKey } from '../../api/models/vaults';
import { VaultService } from '../../api/services';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'kt-api-key-token-dialog',
  templateUrl: './api-key-token.dialog.component.html',
  styleUrls: ['./api-key-token.dialog.component.scss']
})
export class ApiKeyTokenDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ApiKeyTokenDialogComponent>,
    private vaultService: VaultService) {
  }

  apiKey: ApiKey;
  apiKeyId: number;
  vaultId: number;
  token: string;
  viewLoading = false;

  ngOnInit() {
    this.apiKeyId = this.data.apiKeyId;
    this.vaultId = this.data.vaultId;
    this.load();
  }

  load() {
    this.viewLoading = true;
    forkJoin([
      this.vaultService.getApiKeyById(this.vaultId, this.apiKeyId)
      //this.apiKeyService.getToken(this.apiKeyId)
    ]).subscribe(values => {
      this.apiKey = values[0];
      //this.token = values[1].token;
      this.viewLoading = false;
    });
  }
}
