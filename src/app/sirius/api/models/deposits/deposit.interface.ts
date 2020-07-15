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
    state: DepositState;
    sources: Source[];
    amount: number;
    requiredConfirmationsCount: number;
    assetSymbol: string;
    assetAddress: string;
    blockchainName: string;
    brokerAccountName: string;
    createdAt: Date;
    updatedAt: Date;
}
