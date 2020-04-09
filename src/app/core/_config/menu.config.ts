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
					{
						title: 'Dashboard',
						root: true,
						icon: 'flaticon2-architecture-and-city',
						page: '/home/dashboard',
						translate: 'MENU.DASHBOARD',
						bullet: 'dot'
					},
					{ section: 'Billing' },
					{
						title: 'Invoices',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/billing/invoices',
						bullet: 'dot'
					},
					{
						title: 'Cost Analisys',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/billing/report',
						bullet: 'dot'
					},
					{
						title: 'Payment Method',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/billing/payment',
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
					},
					{
						title: 'OMS',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/services/oms',
						bullet: 'dot'
					},
					{
						title: 'KYC',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/services/kyc',
						bullet: 'dot'
					},
					{
						title: 'Token Issue',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/services/tokens',
						bullet: 'dot'
					},
					{
						title: 'Bridge',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/services/bridge',
						bullet: 'dot'
					}
				]
			},
			exchange: {
				items: [
					{
						title: 'Dashboard',
						root: true,
						icon: 'flaticon2-architecture-and-city',
						page: '/services/exchange/dashboard',
						translate: 'MENU.DASHBOARD',
						bullet: 'dot'
					},
					{ section: 'Management' },
					{
						title: 'Instruments',
						root: true,
						icon: 'flaticon2-layers-1',
						page: '/services/exchange/management/instruments',
						bullet: 'dot'
					},
					{
						title: 'API Keys',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/services/exchange/management/api-keys',
						bullet: 'dot'
					},
					{
						title: 'Accounts',
						root: true,
						icon: 'flaticon2-avatar',
						page: '/services/exchange/management/accounts',
						bullet: 'dot'
					},
					{ section: 'Trading' },
					{
						title: 'Order Books',
						root: true,
						icon: 'flaticon2-graphic-1',
						page: '/services/exchange/trading/order-books',
						bullet: 'dot'
					},
					{ section: 'Reporting' },
					{
						title: 'Money Flow',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/services/exchange/reports/cash-operations',
						bullet: 'dot'
					},
					{
						title: 'Trades',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/services/exchange/reports/trades',
						bullet: 'dot'
					},
					{ section: 'Sirius Connection' },
					{
						title: 'Overview',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/services/exchange/sirius/overview',
						bullet: 'dot'
					},
					{
						title: 'Connections',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/services/exchange/sirius/connections',
						bullet: 'dot'
					},
					{ section: 'Liquidity Connection' },
					{
						title: 'OMS',
						root: true,
						icon: 'flaticon2-rocket',
						bullet: 'dot',
						submenu: [
							{
								title: 'Overview',
								page: '/services/exchange/liquidity/oms/overview'
							},
							{
								title: 'Connection',
								page: '/services/exchange/liquidity/oms/connection'
							}
						]
					},
					{
						title: 'SwissChain',
						root: true,
						icon: 'flaticon2-rocket',
						bullet: 'dot',
						submenu: [
							{
								title: 'Overview',
								page: '/services/exchange/liquidity/Swisschain/overview'
							},
							{
								title: 'Connection',
								page: '/services/exchange/liquidity/Swisschain/connection'
							}
						]
					},
					{ section: 'Debugging' },
					{
						title: 'API Calls',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/services/exchange/debugging/api-calls',
						bullet: 'dot'
					}
				]
			},
			sirius: {
				items: [
					{
						title: 'Dashboard',
						root: true,
						icon: 'flaticon2-architecture-and-city',
						page: '/services/sirius/dashboard',
						translate: 'MENU.DASHBOARD',
						bullet: 'dot'
					},
					{ section: 'Brakerage' },
					{
						title: 'Broker Accounts',
						root: true,
						icon: 'flaticon-users',
						page: '/services/sirius/brakerage/broker-accounts',
						bullet: 'dot'
					},
					{
						title: 'Accounts',
						root: true,
						icon: 'flaticon2-group',
						page: '/services/sirius/brakerage/accounts',
						bullet: 'dot'
					},
					{
						title: 'Deposits',
						root: true,
						icon: 'flaticon-coins',
						page: '/services/sirius/brakerage/deposits',
						bullet: 'dot'
					},
					{
						title: 'Withdrawal',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/services/sirius/brakerage/withdrawal',
						bullet: 'dot'
					},
					{ section: 'Wallets' },
					{
						title: 'Overview',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/services/sirius/wallets/overview',
						bullet: 'dot'
					},
					{
						title: 'Management',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/services/sirius/wallets/list',
						bullet: 'dot'
					},
					{
						title: 'API Keys',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/services/sirius/wallets/api-keys',
						bullet: 'dot'
					},
					{ section: 'Vault' },
					{
						title: 'Overview',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/services/sirius/vault/overview',
						bullet: 'dot'
					},
					{
						title: 'Connections',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/services/sirius/vault/connections',
						bullet: 'dot'
					},
					{
						title: 'API Keys',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/services/sirius/vault/api-keys',
						bullet: 'dot'
					},
					{ section: 'Setup' },
					{
						title: 'Blockchain list',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/services/sirius/setup/blockchain-list',
						bullet: 'dot'
					},
					{ section: 'Debugging' },
					{
						title: 'Brokerage API Calls',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/services/sirius/debugging/brokerage/api-calls',
						bullet: 'dot'
					},
					{
						title: 'Wallet API Calls',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/services/sirius/debugging/wallets/api-calls',
						bullet: 'dot'
					},
					{
						title: 'Vault Call History',
						root: true,
						icon: 'flaticon2-rocket',
						page: '/services/sirius/debugging/vault/api-calls',
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
