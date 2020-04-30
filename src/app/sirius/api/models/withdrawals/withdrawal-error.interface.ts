import { WithdrawalErrorCode } from './';

export interface WithdrawalError {
    message: string;
    code: WithdrawalErrorCode;
}