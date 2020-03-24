import { LimitOrderStatus } from './limit-order-status.enum';

export interface LimitOrderCreateResult{
    id: string;
    status: LimitOrderStatus;
    reason: string;
}