export interface Trade {
    id: string;
    brokerId: string;
    externalId: string;
    tradeId: string;
    walletId: string;
    oppositeWalletId: string;
    orderId: number;
    oppositeOrderId: string;
    oppositeExternalOrderId: string;
    orderHistoryId: number;
    baseAssetId: string;
    quotingAssetId: string;
    price: string;
    baseVolume: string;
    quotingVolume: string;
    absoluteSpread: string;
    relativeSpread: string;
    role: string;
    timestamp: Date;
}