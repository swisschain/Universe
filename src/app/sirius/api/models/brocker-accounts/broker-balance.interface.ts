export interface BrokerBalance {
    id: number;
    brokerAccountId: number;
    assetId: number;
    ownedBalance: number;
    availableBalance: number;
    pendingBalance: number;
    reservedBalance: number;
    createdAt: Date;
    updatedAt: Date;
}
