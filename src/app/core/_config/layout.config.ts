import {LayoutConfigModel} from '../_base/layout';

export class LayoutConfig {
	public defaults: LayoutConfigModel = {
		demo: 'demo1',
		// == Base Layout
		self: {
			layout: 'fluid', // fluid|boxed
			body: {
				'background-image': './assets/media/misc/bg-1.jpg',
			},
			logo: {
				dark: './assets/media/logos/logo-light.png',
				light: './assets/media/logos/logo-dark.png',
				brand: './assets/media/logos/logo-light.png',
				green: './assets/media/logos/logo-light.png',
			},
		},
		// == Page Splash Screen loading
		loader: {
			enabled: true,
			type: 'spinner-logo',
			logo: './assets/media/logos/logo-loader.png',
			message: 'Please wait...',
		},
		// == Colors for javascript
		colors: {
			state: {
				brand: '#5d78ff',
				dark: '#282a3c',
				light: '#ffffff',
				primary: '#5867dd',
				success: '#34bfa3',
				info: '#36a3f7',
				warning: '#ffb822',
				danger: '#fd3995',
			},
			base: {
				label: [
					'#c5cbe3',
					'#a1a8c3',
					'#3d4465',
					'#3e4466',
				],
				shape: [
					'#f0f3ff',
					'#d9dffa',
					'#afb4d4',
					'#646c9a',
				],
			},
		},
		header: {
			self: {
				skin: 'light',
				fixed: {
					desktop: true,
					mobile: false,
				},
			},
			menu: {
				self: {
					display: false,
					layout: 'default',
					'root-arrow': false,
				},
				desktop: {
					arrow: true,
					toggle: 'click',
					submenu: {
						skin: 'light',
						arrow: true,
					},
				},
				mobile: {
					submenu: {
						skin: 'dark',
						accordion: true,
					},
				},
			},
		},
		subheader: {
			display: false,
			layout: 'subheader-v1',
			fixed: true,
			width: 'fluid',
			style: 'solid',
		},
		content: {
			width: 'fluid',
		},
		brand: {
			self: {
				skin: 'dark',
			},
		},
		aside: {
			self: {
				skin: 'dark',
				display: true,
				fixed: true,
				minimize: {
					toggle: true,
					default: false,
				},
			},
			footer: {
				self: {
					display: true,
				},
			},
			menu: {
				dropdown: false,
				scroll: false,
				submenu: {
					accordion: true,
					dropdown: {
						arrow: true,
						'hover-timeout': 500,
					},
				},
			},
		},
		footer: {
			self: {
				width: 'fluid',
				fixed: true
			},
		},
	};

	/**
	 * Good place for getting the remote config
	 */
	public get configs(): LayoutConfigModel {
		return this.defaults;
	}
}
