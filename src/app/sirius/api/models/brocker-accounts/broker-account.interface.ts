import { BrokerAccountState } from './';

export interface BrokerAccount {
    id: number;
    name: string;
    state: BrokerAccountState;
    accountCount: number;
    blockchainsCount: number;
    createdAt: Date;
    updatedAt: Date;
}
