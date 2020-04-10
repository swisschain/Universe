import { BrokerAccountRequisites } from './broker-account-requisites.interface';
import { AccountRequisites } from './account-requisites.interface';
import { Fee } from './fee.interface';
import { TransactionInfo } from './transaction-info.interface';
import { DepositState } from './deposit-state.enum';
import { Source } from './source.interface';

export interface Deposit {
    depositId: number;
    brokerAccountId: number;
    brokerAccountRequisites: BrokerAccountRequisites;
    accountId: number;
    referenceId: string;
    accountRequisites: AccountRequisites;
    assetId: number;
    blockchainId: string;
    fees: Fee[];
    transactionInfo: TransactionInfo;
    state: DepositState,
    sources: Source[],
    amount: number;
    detectedDateTime: Date;
    confirmedDateTime: Date;
    completedDateTime: Date;
    failedDateTime: Date;
    cancelledDateTime: Date;
}