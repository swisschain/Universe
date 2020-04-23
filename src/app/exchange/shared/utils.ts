import { BalanceHistoryType } from '../api/models/balances/balance-history-type';

export function getBalanceHistoryTypeTitle(balanceHistoryType: BalanceHistoryType): string {
    switch (balanceHistoryType) {
        case BalanceHistoryType.CashIn:
            return 'Cash In';
        case BalanceHistoryType.CashOut:
            return 'Cash Out';
        case BalanceHistoryType.CashTransfer:
            return 'Transfer';
        case BalanceHistoryType.Order:
            return 'Order';
        case BalanceHistoryType.ReservedBalanceUpdate:
            return 'Reserve';
        default:
            return 'Unknown';
    }
}