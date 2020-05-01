import { FeeType } from './fee-type.enum';

export interface CashOperationsFee {
    id: string;
    asset: string;
    cashInValue: number;
    cashInFeeType: FeeType;
    cashOutValue: number;
    cashOutFeeType: FeeType;
    cashTransferValue: number;
    cashTransferFeeType: FeeType;
    created: Date;
    modified: Date;
}
