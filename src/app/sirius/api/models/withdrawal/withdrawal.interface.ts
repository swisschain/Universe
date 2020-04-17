import { BrokerAccountRequisites } from '../deposits/broker-account-requisites.interface';
import { AccountRequisites } from '../deposits/account-requisites.interface';
import { Fee } from '../deposits/fee.interface';
import { DestinationRequisites } from './destination-requisites.interface';
import { WithdrawalState } from './withdrawal-state.enum';
import { TransactionInfo } from '../deposits/transaction-info.interface';
import { WithdrawalError } from './withdrawal-error.interface';

export interface Withdrawal {
    id: number,
    brokerAccountId: number,
    accountId: number,
    referenceId: string,
    amount: number,
    assetId: number,
    blockchainId: string,
    brokerAccountRequisites: BrokerAccountRequisites,
    accountRequisites: AccountRequisites,
    fees: Fee[],
    destinationRequisites: DestinationRequisites,
    state: WithdrawalState;
    operationId: number;
    createdAt: Date;
    updatedAt: Date;
    transactionInfo: TransactionInfo,
    error: WithdrawalError
}