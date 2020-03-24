import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PartialsModule } from '../../partials/partials.module';
import { AssetsListComponent } from './assets-list/assets-list.component';
import { AssetEditDialogComponent } from './asset-edit/asset-edit.dialog.component';
import { AssetPairsListComponent } from './asset-pairs-list/asset-pairs-list.component';
import { AssetPairEditDialogComponent } from './asset-pair-edit/asset-pair-edit.dialog.component';
import { InstrumentsRoutingModule } from './instruments-routing.module';
import { ApiModule } from '../../../api/api.module';
import { EffectsModule } from '@ngrx/effects';
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService } from '../../../core/_base/crud';
import { ActionNotificationComponent, DeleteEntityDialogComponent, FetchEntityDialogComponent, UpdateStatusDialogComponent } from '../../partials/content/crud';
import { ModuleGuard } from '../../../core/auth';
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatProgressBarModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatTabsModule,
	MatNativeDateModule,
	MatCardModule,
	MatRadioModule,
	MatIconModule,
	MatDatepickerModule,
	MatAutocompleteModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule
} from '@angular/material';


@NgModule({
	declarations: [
		AssetsListComponent,
		AssetEditDialogComponent,
		AssetPairsListComponent,
		AssetPairEditDialogComponent],
	imports: [
		CommonModule,
		InstrumentsRoutingModule,
		ApiModule,

		MatDialogModule,
		CommonModule,
		HttpClientModule,
		PartialsModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
		MatInputModule,
		MatTableModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatTabsModule,
		MatTooltipModule
	],
	providers: [
		ModuleGuard,
		// InterceptService,
		// {
		// 	provide: HTTP_INTERCEPTORS,
		//  	useClass: InterceptService,
		// 	multi: true
		// },
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'kt-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px'
			}
		},
		TypesUtilsService,
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [
		AssetEditDialogComponent,
		AssetPairEditDialogComponent,
		ActionNotificationComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent
	]
})
export class InstrumentsModule { }
