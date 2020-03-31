import { BrokerAccountState } from './broker-account-state.enum';

export interface BrokerAccount {
    brokerAccountId:string;
    name:string;
    state: BrokerAccountState;
    creationDateTime: Date;
    blockingDateTime: Date;
    activationDateTime: Date;
}