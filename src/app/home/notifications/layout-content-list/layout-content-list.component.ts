import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { Layout, LayoutContent } from '../../api/models/notifications';
import { LayoutService } from '../../api/services';
import { LayoutContentDataSource } from '../../data-sources';

@Component({
  selector: 'kt-layout-content-list',
  templateUrl: './layout-content-list.component.html',
  styleUrls: ['./layout-content-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutContentListComponent implements OnInit {

  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private layoutService: LayoutService) { }

  private layout: Layout;

  allowEdit = false;

  dataSource: LayoutContentDataSource;
  displayedColumns = ['language', 'created', 'modified', 'actions'];

  @Input()
  set parent(layout: Layout) {
    if (layout) {
      this.layout = layout;
      this.allowEdit = layout.isPersonalized;
      this.load();
    } else {
      this.allowEdit = false;
    }
  }

  get parent(): Layout { return this.layout; }

  ngOnInit() {
    this.dataSource = new LayoutContentDataSource(this.layoutService);
  }

  load() {
    this.dataSource.load(this.layout.id);
  }

  delete(content: LayoutContent) {
    const dialogRef = this.layoutUtilsService.deleteElement('Delete layout content', 'Are you sure you want to delete layout content?', 'Layout content is deleting...');
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.layoutService.deleteContent(this.layout.id, content.id)
          .subscribe(
            response => {
              this.layoutUtilsService.showActionNotification('Layout content has been deleted.', MessageType.Delete, 3000, true, false);
              this.load();
            },
            error => {
              this.layoutUtilsService.showActionNotification('An error occurred while deleting layout content.', MessageType.Update, 3000, true, false);
            }
          );
      });
  }
}
