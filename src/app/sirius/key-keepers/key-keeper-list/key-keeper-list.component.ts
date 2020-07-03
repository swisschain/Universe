import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';

import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { formatAddress } from '../../shared/address-utils';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { KeyKeeperService } from '../../api/services';
import { KeyKeeperDataSource } from '../../data-sources';
import { KeyKeeperEditDialogComponent } from '../key-keeper-edit/key-keeper-edit.dialog.component';

@Component({
  selector: 'kt-key-keeper-list',
  templateUrl: './key-keeper-list.component.html',
  styleUrls: ['./key-keeper-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyKeeperListComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private keyKeeperService: KeyKeeperService) { }

  private subscriptions: Subscription[] = [];

  searchByKeyIdInput = new FormControl();
  searchByDescriptionInput = new FormControl();

  dataSource: KeyKeeperDataSource;
  displayedColumns = ['keyKeeperId', 'keyId', 'description', 'createdAt', 'updatedAt', 'actions'];

  keyId = '';
  description = '';

  ngOnInit() {
    this.dataSource = new KeyKeeperDataSource(this.keyKeeperService);

    const searchByKeyIdSubscription = this.searchByKeyIdInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.keyId = value;
        this.load();
      });

    this.subscriptions.push(searchByKeyIdSubscription);

    const searchByDescriptionSubscription = this.searchByDescriptionInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.description = value;
        this.load();
      });

    this.subscriptions.push(searchByDescriptionSubscription);
  }

  ngAfterViewInit() {
    this.load();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  load() {
    this.dataSource.load(this.keyId, this.description);
  }

  getKeyId(address: string){
    return formatAddress(address);
  }

  add() {
    this.edit(null);
  }

  edit(keyKeeperId: number) {
    const saveMessage = keyKeeperId ? 'Key keeper updated' : 'Key keeper added';
    const messageType = keyKeeperId ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(KeyKeeperEditDialogComponent, { data: { keyKeeperId }, width: '600px' });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.layoutUtilsService.showActionNotification(saveMessage, messageType, 1000, true, false);
      this.load();
    });
  }
}
