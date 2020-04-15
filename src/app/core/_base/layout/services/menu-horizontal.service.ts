import { Injectable } from '@angular/core';
import * as objectPath from 'object-path';
import { MenuConfigService } from './menu-config.service';

@Injectable()
export class MenuHorizontalService {

	constructor(private menuConfigService: MenuConfigService) {
	}

	getItems(path: string) {
		if (path.indexOf('/home/') !== -1)
			return objectPath.get(this.menuConfigService.getMenus(), 'header.home.items');
		if (path.indexOf('/profile/') !== -1)
			return objectPath.get(this.menuConfigService.getMenus(), 'header.profile.items');
		if (path.indexOf('/exchange/') !== -1)
			return objectPath.get(this.menuConfigService.getMenus(), 'header.exchange.items');
		if (path.indexOf('/sirius/') !== -1)
			return objectPath.get(this.menuConfigService.getMenus(), 'header.sirius.items');
	}
}
