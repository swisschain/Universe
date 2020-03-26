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
		if (path.indexOf('/exchange/') !== -1)
			return objectPath.get(this.menuConfigService.getMenus(), 'aside.exchange.items');
		if (path.indexOf('/sirius/') !== -1)
			return objectPath.get(this.menuConfigService.getMenus(), 'aside.sirius.items');
	}
}
