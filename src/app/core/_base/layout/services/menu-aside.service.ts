import { Injectable } from '@angular/core';
import * as objectPath from 'object-path';
import { MenuConfigService } from './menu-config.service';

@Injectable()
export class MenuAsideService {

	/**
	 * Service constructor
	 *
	 * @param menuConfigService: MenuConfigService
	 */
	constructor(private menuConfigService: MenuConfigService) {
	}

	getItems(path: string) {
		if (path.indexOf('/home/') !== -1)
			return objectPath.get(this.menuConfigService.getMenus(), 'aside.home.items');
		if (path.indexOf('/profile/') !== -1)
			return objectPath.get(this.menuConfigService.getMenus(), 'aside.profile.items');
		if (path.indexOf('/exchange/') !== -1)
			return objectPath.get(this.menuConfigService.getMenus(), 'aside.exchange.items');
		if (path.indexOf('/sirius/') !== -1)
			return objectPath.get(this.menuConfigService.getMenus(), 'aside.sirius.items');
	}

	getTitle(path: string) {
		if (path.indexOf('/profile/') !== -1)
			return 'Account';
		if (path.indexOf('/exchange/') !== -1)
			return 'Exchange';
		if (path.indexOf('/sirius/') !== -1)
			return 'Sirius';
		return '';
	}

	showTitle(path: string) : boolean {
		if (path.indexOf('/home/') !== -1)
			return false;
		return true;
	}
}
