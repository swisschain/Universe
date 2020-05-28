import { Product } from './product.enum';

export interface Layout {
    id: string;
    product: Product;
    isPersonalized: boolean;
    created: Date;
    modified: Date;
}
