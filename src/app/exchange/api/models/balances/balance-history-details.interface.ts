import { BalanceHistoryType } from './balance-history-type';

export interface BalanceHistoryDetails {
    asset: string;
    volume: number;
    type: BalanceHistoryType;
    toWallet: string;
    fromWallet: string;
    description: string;
}
