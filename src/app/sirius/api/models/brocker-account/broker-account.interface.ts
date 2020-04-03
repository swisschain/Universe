import { BrokerAccountState } from './broker-account-state.enum';

export interface BrokerAccount {
    brokerAccountId: number;
    name: string;
    state: BrokerAccountState;
    creationDateTime: Date;
    blockingDateTime: Date;
    activationDateTime: Date;
}