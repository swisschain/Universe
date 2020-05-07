import { FeeType } from './fee-type.enum';
import { OperationType } from './operation-type.enum';

export interface CashOperationsFeeHistory {
    id: string;
    cashOperationsFeeId: string;
    brokerId: string;
    userId: string;
    asset: string;
    cashInValue: number;
    cashInFeeType: FeeType;
    cashOutValue: number;
    cashOutFeeType: FeeType;
    cashTransferValue: number;
    cashTransferFeeType: FeeType;
    operationType: OperationType;
    timestamp: Date;
}
