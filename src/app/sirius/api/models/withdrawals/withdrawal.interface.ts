import { BrokerAccountRequisites, AccountRequisites, Fee, TransactionInfo } from '../deposits';
import { DestinationRequisites, WithdrawalState, WithdrawalError } from './';

export interface Withdrawal {
    id: number;
    brokerAccountId: number;
    accountId: number;
    referenceId: string;
    amount: number;
    assetId: number;
    blockchainId: string;
    brokerAccountDetails: BrokerAccountRequisites;
    accountDetails: AccountRequisites;
    fees: Fee[];
    destinationDetails: DestinationRequisites;
    state: WithdrawalState;
    operationId: number;
    transactionInfo: TransactionInfo;
    error: WithdrawalError;
    requiredConfirmationsCount: number;
    assetSymbol: string;
    assetAddress: string;
    blockchainName: string;
    brokerAccountName: string;
    createdAt: Date;
    updatedAt: Date;
}
