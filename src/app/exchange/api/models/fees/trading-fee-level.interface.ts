export interface TradingFeeLevel {
    id: string;
    tradingFeeId: string;
    volume: number;
    makerFee: number;
    takerFee: number;
    created: Date;
    modified: Date;
}
