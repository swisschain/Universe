export interface OrderBookRowItem {
    assetPairId: string;
    ask: number;
    bid: number;
    mid: number;
    spread: number;
    sellOrdersCount: number;
    buyOrdersCount: number;
    timestamp: Date;
}