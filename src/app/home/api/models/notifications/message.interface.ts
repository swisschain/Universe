import { Product } from './product.enum';
import { Channel } from './channel.enum';
import { MessageStatus } from './message-status.enum';

export interface Message {
    id: string;
    product: Product;
    channel: Channel;
    templateName: string;
    contextId: string;
    address: string;
    subject: string;
    body: string;
    status: MessageStatus;
    created: Date;
    sent: Date;
    errorReason: string;
}
