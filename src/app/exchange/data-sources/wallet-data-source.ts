import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BaseDataSource } from './base-data-source';

import { Wallet, WalletType } from '../api/models/wallets'
import { WalletService } from '../api/services';
import { PagedResponse } from '../api/models/pagination';

export class WalletDataSource extends BaseDataSource<Wallet> {

    constructor(private walletService: WalletService) {
        super();
    }

    load(accountId: number, name: string, isEnabled: boolean, type: WalletType) {
        this.loadingSubject.next(true);
        this.walletService.get(accountId, name, isEnabled, type)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((response: PagedResponse<Wallet>) => {
                this.itemsSubject.next(response.items)
            });
    }
}
