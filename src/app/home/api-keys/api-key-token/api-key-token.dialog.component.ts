import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ApiKey } from '../../api/models/api-keys';
import { ApiKeyService } from '../../api/services';
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
    private apiKeyService: ApiKeyService) {
  }

  apiKey: ApiKey;
  apiKeyId: string;
  token: string;
  viewLoading = false;

  ngOnInit() {
    this.apiKeyId = this.data.apiKeyId;
    this.load();
  }

  load() {
    this.viewLoading = true;

    forkJoin([
      this.apiKeyService.getById(this.apiKeyId),
      this.apiKeyService.getToken(this.apiKeyId)
    ]).subscribe(values => {
      this.apiKey = values[0];
      this.token = values[1].token;
      this.viewLoading = false;
    });
  }
}
