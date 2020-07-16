export interface BrokerBalance {
    id: number;
    brokerAccountId: number;
    assetId: number;
    ownedBalance: number;
    availableBalance: number;
    pendingBalance: number;
    reservedBalance: number;
    assetSymbol: string;
    assetAddress: string;
    blockchainName: string;
    createdAt: Date;
    updatedAt: Date;
}
