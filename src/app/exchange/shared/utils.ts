import { BalanceHistoryType } from '../api/models/balances/balance-history-type';
import { OperationType } from '../api/models/fees';

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

export function getHistoryTypeTitle(operationType: OperationType): string {
    switch (operationType) {
        case OperationType.Created:
            return 'Created';
        case OperationType.Modified:
            return 'Modified';
        case OperationType.Deleted:
            return 'Deleted';
        default:
            return 'Unknown';
    }
}
