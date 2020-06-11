import { Product } from './product.enum';
import { Channel } from './channel.enum';

export interface NotificationApiKey {
    id: string;
    providerId: string;
    product: Product;
    channel: Channel;
    from: string;
    value: string;
    created: Date;
    modified: Date;
}
