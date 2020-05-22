export interface TradingFeeLevel {
    id: number;
    tradingFeeId: number;
    volume: number;
    makerFee: number;
    takerFee: number;
    created: Date;
    modified: Date;
}
