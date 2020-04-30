import { BrokerAccountRequisites, AccountRequisites, Fee, TransactionInfo, DepositState, Source } from './';

export interface Deposit {
    id: number;
    brokerAccountId: number;
    brokerAccountDetails: BrokerAccountRequisites;
    accountId: number;
    referenceId: string;
    accountDetails: AccountRequisites;
    assetId: number;
    blockchainId: string;
    fees: Fee[];
    transactionInfo: TransactionInfo;
    state: DepositState,
    sources: Source[],
    amount: number;
    createdAt: Date;
    updatedAt: Date;
}