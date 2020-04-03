import { AccountState } from './account-state.enum';

export interface Account {
    accountId: number;
    referenceId: string;
    brokerAccountId: number;
    state: AccountState;
    creationDateTime: Date;
    blockingDateTime: Date;
    activationDateTime: Date;
}