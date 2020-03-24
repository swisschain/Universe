import { LimitOrderType } from './limit-order-type.enum';

export interface LimitOrder {
    id: string;
    price: number;
    volume: number;
    walletId: string;
    type: LimitOrderType;
}