import { SortOrder } from './sort-order';

export interface Page {
    cursor: string;
    count: number;
    order: SortOrder;
    nextUrl: string;
}