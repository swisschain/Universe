import { PagedRequest } from '../pagination/paged-request.interface';
import { BrokerAccountState } from './broker-account-state.enum';

export interface BrockerAccountRequest extends PagedRequest
{
    name: string;
    brokerAccountId: string;
    state: BrokerAccountState;    
}