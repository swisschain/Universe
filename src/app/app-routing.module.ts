// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './views/theme/base/base.component';
import { ErrorPageComponent } from './views/theme/content/error-page/error-page.component';
// Auth
import { AuthGuard } from './core/auth';
import { SubscriptionGuard } from './core/auth/_guards/subscription.guard';

const routes: Routes = [
	{
		path: 'auth',
		loadChildren: () => import('app/views/pages/auth/auth.module').then(m => m.AuthModule)
	},
	{
		path: '',
		component: BaseComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'home',
				loadChildren: () => import('app/home/home.module').then(m => m.HomeModule),
				canActivate: [SubscriptionGuard]
			},
			{
				path: 'profile',
				loadChildren: () => import('app/profile/profile.module').then(m => m.ProfileModule),
			},
			{
				path: 'services',
				children:[
					{
						path: 'exchange',
						loadChildren: () => import('app/exchange/exchange.module').then(m => m.ExchangeModule),
					},
					{
						path: 'sirius',
						loadChildren: () => import('app/sirius/sirius.module').then(m => m.SiriusModule),
					}
				],
				canActivate: [SubscriptionGuard]
			},
			{
				path: 'error/403',
				component: ErrorPageComponent,
				data: {
					type: 'error-v6',
					code: 403,
					title: '403... Access forbidden',
					desc: 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator',
				},
			},
			{ path: 'error/:type', component: ErrorPageComponent },
			{ path: '', redirectTo: 'home', pathMatch: 'full' },
			{ path: '**', redirectTo: 'home/comming-soon', pathMatch: 'full' },
		],
	},
	{ path: '**', redirectTo: 'error/403', pathMatch: 'full' },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {
}
