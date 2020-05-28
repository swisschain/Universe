import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

import { LayoutUtilsService, MessageType } from '../../../core/_base/crud';

import { Template, TemplateContent, Channel } from '../../api/models/notifications';
import { TemplateService } from '../../api/services';
import { TemplateContentDataSource } from '../../data-sources';
import { TemplateContentEditDialogComponent } from '../template-content-edit/template-content-edit.dialog.component';

@Component({
  selector: 'kt-template-content-list',
  templateUrl: './template-content-list.component.html',
  styleUrls: ['./template-content-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateContentListComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private templateService: TemplateService) { }

  private template: Template;
  private isLoaded = false;

  allowEdit = false;

  dataSource: TemplateContentDataSource;
  displayedColumns = ['language', 'created', 'modified', 'actions'];

  @Input() channel: Channel;

  @Input()
  set parent(template: Template) {
    if (template) {
      this.template = template;
      this.allowEdit = template.isPersonalized;
      this.load();
    } else {
      this.allowEdit = false;
    }
  }

  get parent(): Template { return this.template; }

  ngOnInit() {
    this.dataSource = new TemplateContentDataSource(this.templateService);

    if (!this.isLoaded) {
      this.load();
    }
  }

  load() {
    if (this.dataSource && this.template) {
      this.dataSource.load(this.template.id, this.channel);
      this.isLoaded = true;
    }
  }

  add() {
    this.edit(null);
  }

  edit(content: TemplateContent) {
    const saveMessage = content ? 'Template content updated' : 'Template content added';
    const messageType = content ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(TemplateContentEditDialogComponent, {
      data: {
        templateId: this.template.id,
        contentId: content ? content.id : null,
        channel: this.channel,
      }, width: '700px'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.layoutUtilsService.showActionNotification(saveMessage, messageType, 1000, true, false);
      this.load();
    });
  }

  delete(content: TemplateContent) {
    const dialogRef = this.layoutUtilsService.deleteElement('Delete template content', 'Are you sure you want to delete template content?', 'Template content is deleting...');
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }

        this.templateService.deleteContent(this.template.id, content.id)
          .subscribe(
            response => {
              this.layoutUtilsService.showActionNotification('Template content has been deleted.', MessageType.Delete, 3000, true, false);
              this.load();
            },
            error => {
              this.layoutUtilsService.showActionNotification('An error occurred while deleting template content.', MessageType.Update, 3000, true, false);
            }
          );
      });
  }
}
