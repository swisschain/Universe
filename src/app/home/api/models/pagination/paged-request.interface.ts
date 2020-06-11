import { SortOrder } from './sort-order';

export interface PagedRequest {
    cursor: string;
    count: number;
    order: SortOrder;
}