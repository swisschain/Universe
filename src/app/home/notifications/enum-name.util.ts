import { Product, Channel, MessageStatus } from '../api/models/notifications';

export function getProductTitle(product: Product): string {
    switch (product) {
        case Product.Sirius:
            return 'Sirius';
        case Product.Antares:
            return 'Antares';
        default:
            return '';
    }
}

export function getChannelTitle(channel: Channel): string {
    switch (channel) {
        case Channel.Email:
            return 'Email';
        case Channel.Sms:
            return 'SMS';
        case Channel.Push:
            return 'PUSH';
        default:
            return '';
    }
}

export function getMessageStatusTitle(messageStatus: MessageStatus): string {
    switch (messageStatus) {
        case MessageStatus.New:
            return 'New';
        case MessageStatus.Sent:
            return 'Sent';
        case MessageStatus.Error:
            return 'Error';
        default:
            return '';
    }
}
