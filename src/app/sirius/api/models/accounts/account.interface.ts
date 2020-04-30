import { AccountState } from './';

export interface Account {
    id: number;
    referenceId: string;
    brokerAccountId: number;
    state: AccountState;
    createdAt: Date;
    updatedAt: Date;
}