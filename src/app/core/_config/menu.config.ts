export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			home: {
				items: [
					{
						title: 'Dashboard',
						root: true,
						page: '/home/dashboard',
						translate: 'MENU.DASHBOARD'
					}]
			},
			profile: {
				items: [
					{
						title: 'Home',
						root: true,
						page: '/home/dashboard'
					}]
			},
			exchange: {
				items: [
					{
						title: 'Home',
						root: true,
						page: '/home/dashboard'
					},
					{
						title: 'Dashboard',
						root: true,
						page: '/services/exchange/dashboard',
						translate: 'MENU.DASHBOARD'
					}]
			},
			sirius: {
				items: [
					{
						title: 'Home',
						root: true,
						page: '/home/dashboard'
					},
					{
						title: 'Dashboard',
						root: true,
						page: '/services/sirius/dashboard',
						translate: 'MENU.DASHBOARD'
					}]
			}
		},
		aside: {
			home: {
				items: [
					{ section: 'Billing' },
					{
						title: 'Account',
						root: true,
						icon: 'flaticon-profile-1',
						page: '/profile',
						bullet: 'dot'
					},
					{
						title: 'API Keys',
						root: true,
						icon: 'flaticon2-safe',
						page: '/home/api-keys',
						bullet: 'dot'
					},
					{ section: 'Notifications' },
					{
						title: 'Layouts',
						root: true,
						icon: 'flaticon-star',
						page: '/home/notifications/layouts',
						bullet: 'dot'
					},
					{
						title: 'Templates',
						root: true,
						icon: 'flaticon-star',
						page: '/home/notifications/templates',
						bullet: 'dot'
					},
					{
						title: 'API Keys',
						root: true,
						icon: 'flaticon-star',
						page: '/home/notifications/api-keys',
						bullet: 'dot'
					},
					{
						title: 'Messages',
						root: true,
						icon: 'flaticon-star',
						page: '/home/notifications/messages',
						bullet: 'dot'
					},
					{ section: 'Services' },
					{
						title: 'Sirius',
						root: true,
						icon: 'flaticon-star',
						page: '/services/sirius',
						bullet: 'dot'
					},
					{
						title: 'Exchange',
						root: true,
						icon: 'flaticon2-line-chart',
						page: '/services/exchange',
						bullet: 'dot'
					}					
				]
			},
			profile: {
				items: [
					{
						title: 'Profile',
						root: true,
						icon: 'flaticon-avatar',
						page: '/profile/account',
						bullet: 'dot'
					},
					{
						title: 'Subscriptions',
						root: true,
						icon: 'flaticon2-delivery-package',
						page: '/profile/subscriptions',
						bullet: 'dot'
					},
				]
			},
			exchange: {
				items: [
					{ section: 'Management' },
					{
						title: 'Instruments',
						root: true,
						icon: 'flaticon2-layers-1',
						page: '/services/exchange/management/instruments',
						bullet: 'dot'
					},
					{
						title: 'Accounts',
						root: true,
						icon: 'flaticon2-avatar',
						page: '/services/exchange/management/accounts',
						bullet: 'dot'
					},
					{ section: 'Fees' },
					{
						title: 'Cash Operations',
						root: true,
						icon: 'flaticon2-avatar',
						page: '/services/exchange/fees/cash-operations',
						bullet: 'dot'
					},
					{
						title: 'Trading',
						root: true,
						icon: 'flaticon2-avatar',
						page: '/services/exchange/fees/trading',
						bullet: 'dot'
					},
					{
						title: 'Audit',
						root: true,
						icon: 'flaticon2-avatar',
						page: '/services/exchange/fees/audit',
						bullet: 'dot'
					},
					{
						title: 'Settings',
						root: true,
						icon: 'flaticon2-avatar',
						page: '/services/exchange/fees/settings',
						bullet: 'dot'
					},
					{ section: 'Trading' },
					{
						title: 'Order Books',
						root: true,
						icon: 'flaticon2-graphic-1',
						page: '/services/exchange/trading/order-books',
						bullet: 'dot'
					}					
				]
			},
			sirius: {
				items: [
					{ section: 'Brokerage' },
					{
						title: 'Broker Accounts',
						root: true,
						icon: 'flaticon-users',
						page: '/services/sirius/brokerage/broker-accounts',
						bullet: 'dot'
					},
					{
						title: 'Accounts',
						root: true,
						icon: 'flaticon2-group',
						page: '/services/sirius/brokerage/accounts',
						bullet: 'dot'
					},
					{
						title: 'Deposits',
						root: true,
						icon: 'flaticon-coins',
						page: '/services/sirius/brokerage/deposits',
						bullet: 'dot'
					},
					{
						title: 'Withdrawal',
						root: true,
						icon: 'flaticon2-list',
						page: '/services/sirius/brokerage/withdrawals',
						bullet: 'dot'
					},
					{ section: 'Vault' },
					{
						title: 'Vaults',
						root: true,
						icon: 'flaticon2-list',
						page: '/services/sirius/vaults',
						bullet: 'dot'
					},
					{
						title: 'Key Keepers',
						root: true,
						icon: 'flaticon2-list',
						page: '/services/sirius/key-keepers',
						bullet: 'dot'
					},
					{
						title: 'Configuration',
						root: true,
						icon: 'flaticon2-list',
						page: '/services/sirius/key-keeping-configuration',
						bullet: 'dot'
					}
				]
			}
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
