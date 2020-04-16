import { LimitOrder } from './limit-order.interface';

export interface OrderBook {
    symbol: string;
    limitOrders: LimitOrder[];
    timestamp: Date;
}