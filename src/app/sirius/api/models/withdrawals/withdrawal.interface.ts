import { BrokerAccountRequisites, AccountRequisites, Fee, TransactionInfo } from '../deposits';
import { DestinationRequisites, WithdrawalState, WithdrawalError } from './';

export interface Withdrawal {
    id: number,
    brokerAccountId: number,
    accountId: number,
    referenceId: string,
    amount: number,
    assetId: number,
    blockchainId: string,
    brokerAccountDetails: BrokerAccountRequisites,
    accountDetails: AccountRequisites,
    fees: Fee[],
    destinationDetails: DestinationRequisites,
    state: WithdrawalState;
    operationId: number;
    createdAt: Date;
    updatedAt: Date;
    transactionInfo: TransactionInfo,
    error: WithdrawalError
}