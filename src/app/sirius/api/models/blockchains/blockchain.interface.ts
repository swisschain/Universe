import { Protocol } from './protocol.interface';

export interface Blockchain {
    blockchainId: string;
    name: string;
    networkType: string;
    protocol: Protocol;
}