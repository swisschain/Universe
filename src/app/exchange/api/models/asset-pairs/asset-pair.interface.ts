export interface AssetPair {
    symbol: string;
    baseAsset: string;
    quotingAsset: string;
    accuracy: number;
    minVolume: number;
    maxVolume: number;
    maxOppositeVolume: number;
    marketOrderPriceThreshold: number;
    isDisabled: boolean,
    created: Date;
    modified: Date
}