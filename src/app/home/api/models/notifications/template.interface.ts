import { Product } from './product.enum';

export interface Template {
    id: string;
    name: string;
    product: Product;
    parameters: string;
    isPersonalized: boolean;
    created: Date;
    modified: Date;
}
