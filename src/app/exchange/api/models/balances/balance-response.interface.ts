import { Balance } from './balance.interface';

export interface BalanceResponse {
    walletId: string;
    timestamp: Date;
    list: Balance[];
}
