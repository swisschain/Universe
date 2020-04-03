export interface BrokerBalance {
    id: number;
    sequence: number;
    brokerAccountId: number;
    assetId: number;
    ownedBalance: number;
    availableBalance: number;
    pendingBalance: number;
    reservedBalance: number;
    ownedBalanceUpdateDateTime: Date;
    availableBalanceUpdateDateTime: Date;
    pendingBalanceUpdateDateTime: Date;
    reservedBalanceUpdateDateTime: Date;
}