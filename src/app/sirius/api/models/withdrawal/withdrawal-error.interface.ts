import { WithdrawalErrorCode } from './withdrawal-error-code.interface';

export interface WithdrawalError {
    message: string;
    code: WithdrawalErrorCode;
}