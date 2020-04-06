import { LimitOrder } from './limit-order.interface';

export interface OrderBook {
    assetPairId: string;
    limitOrders: LimitOrder[];
    timestamp: Date;
}