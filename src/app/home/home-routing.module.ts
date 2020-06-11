import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WorkingOnItComponent } from './shared/working-on-it/working-on-it.component';
import { ApiKeysComponent } from './api-keys/api-keys/api-keys.component';
import { LayoutListComponent } from './notifications/layout-list/layout-list.component';
import { LayoutComponent } from './notifications/layout/layout.component';
import { LayoutContentEditComponent } from './notifications/layout-content-edit/layout-content-edit.component';
import { TemplateListComponent } from './notifications/template-list/template-list.component';
import { TemplateComponent } from './notifications/template/template.component';
import { TemplateContentEmailEditComponent } from './notifications/template-content-email-edit/template-content-email-edit.component';
import { NotificationApiKeyListComponent } from './notifications/api-key-list/api-key-list.component';
import { MessageListComponent } from './notifications/message-list/message-list.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'api-keys',
        component: ApiKeysComponent
    },
    {
        path: 'notifications/layouts',
        component: LayoutListComponent
    },
    {
        path: 'notifications/layouts/:layoutId',
        component: LayoutComponent
    },
    {
        path: 'notifications/layouts/:layoutId/content/:contentId',
        component: LayoutContentEditComponent
    },
    {
        path: 'notifications/templates',
        component: TemplateListComponent
    },
    {
        path: 'notifications/templates/:templateId',
        component: TemplateComponent
    },
    {
        path: 'notifications/templates/:templateId/email-content/:contentId',
        component: TemplateContentEmailEditComponent
    },
    {
        path: 'notifications/api-keys',
        component: NotificationApiKeyListComponent
    },
    {
        path: 'notifications/messages',
        component: MessageListComponent
    },
    {
        path: 'comming-soon',
        component: WorkingOnItComponent
    },
    {
        path: '',
        redirectTo: 'api-keys',
        pathMatch: 'full'
    },
    {
        path: 'comming-soon',
        component: WorkingOnItComponent
    },
    { path: '**', redirectTo: 'comming-soon', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }