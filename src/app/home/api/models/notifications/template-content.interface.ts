import { Channel } from './channel.enum';

export interface TemplateContent {
    id: string;
    language: string;
    channel: Channel;
    subject: string;
    content: string;
    created: Date;
    modified: Date;
}
