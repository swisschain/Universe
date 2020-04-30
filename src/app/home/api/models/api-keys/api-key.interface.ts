import { Product } from './product.enum';

export interface ApiKey {
    id: string;
    name: string;
    description: string;
    expirationDate: Date;
    products: Product[];
    isDeleted: boolean;
    created: Date;
    modified: Date;
}