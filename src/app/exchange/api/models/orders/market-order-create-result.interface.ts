import { LimitOrderStatus } from './limit-order-status.enum';

export interface MarketOrderCreateResult {
    id: string;
    price: number;
    status: LimitOrderStatus;
    reason: string;
}