import { Product } from '../../api/models/api-keys';

export function getProductName(product: Product): string {
    switch (product) {
        case Product.Sirius:
            return 'Sirius';
        case Product.Exchange:
            return 'Exchange';
        default:
            return '';
    }
}