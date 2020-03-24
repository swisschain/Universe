export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			items: [
				{
					title: 'Dashboards',
					root: true,
					alignment: 'left',
					page: '/dashboard',
					translate: 'MENU.DASHBOARD'
				},
				{
					title: 'Instruments',
					root: true,
					alignment: 'left',
					toggle: 'click',
					submenu: [
						{
							title: 'Assets',
							root: true,
							icon: 'flaticon2-layers-1',
							page: '/instruments/assets',
							bullet: 'dot'
						},
						{
							title: 'Asset Pairs',
							root: true,
							icon: 'flaticon2-layers-2',
							page: '/instruments/asset-pairs',
							bullet: 'dot'
						}]
				},
				{
					title: 'Accounts',
					root: true,
					alignment: 'left',
					toggle: 'click',
					submenu: [
						{
							title: 'Balances',
							root: true,
							icon: 'flaticon-coins',
							page: '/balances/accounts',
							bullet: 'dot'
						}]
				},
				{
					title: 'Orders',
					root: true,
					alignment: 'left',
					toggle: 'click',
					submenu: [
						{
							title: 'Order Books',
							root: true,
							icon: 'flaticon2-infographic',
							page: '/order-books/list',
							bullet: 'dot'
						}]
				}
			]
		},
		aside: {
			self: {},
			items: [
				{
					title: 'Dashboard',
					root: true,
					icon: 'flaticon2-architecture-and-city',
					page: '/dashboard',
					translate: 'MENU.DASHBOARD',
					bullet: 'dot'
				},
				{ section: 'Instruments' },
				{
					title: 'Assets',
					root: true,
					icon: 'flaticon2-layers-1',
					page: '/instruments/assets',
					bullet: 'dot'
				},
				{
					title: 'Asset Pairs',
					root: true,
					icon: 'flaticon2-layers-2',
					page: '/instruments/asset-pairs',
					bullet: 'dot'
				},
				{ section: 'Accoutns' },
				{
					title: 'Balances',
					root: true,
					icon: 'flaticon-coins',
					page: '/balances/accounts',
					bullet: 'dot'
				},
				{ section: 'Orders' },
				{
					title: 'Order Books',
					root: true,
					icon: 'flaticon2-infographic',
					page: '/order-books/list',
					bullet: 'dot'
				}
			]
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
