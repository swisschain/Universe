export interface TransactionInfo {
    transactionId: string;
    transactionBlock: number;
    confirmationsCount: number;
    requiredConfirmationsCount: number;
    date: Date;
}
