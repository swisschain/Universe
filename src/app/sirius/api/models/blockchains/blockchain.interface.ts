import { Protocol, NetworkType } from './';

export interface Blockchain {
    id: string;
    name: string;
    networkType: NetworkType;
    protocol: Protocol;
}
