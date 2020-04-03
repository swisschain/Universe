export interface AssetPair {
    id: string;
    name: string;
    baseAssetId: string;
    quotingAssetId: string;
    accuracy: number;
    minVolume: number;
    maxVolume: number;
    maxOppositeVolume: number;
    marketOrderPriceThreshold: number;
    isDisabled: boolean,
    created: Date;
    modified: Date
}