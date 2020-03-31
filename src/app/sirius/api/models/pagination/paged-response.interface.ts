import { Page } from './page.interface';

export interface PagedResponse<T> {
    items: T[];
    pagination: Page;
}