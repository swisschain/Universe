import { BalanceHistoryType } from './balance-history-type';

export interface BalanceHistory {
    id: number;
    wallet: string;
    asset: string;
    balance: string;
    oldBalance: string;
    reserved: string;
    oldReserved: string;
    eventType: BalanceHistoryType;
    timestamp: Date;
}
