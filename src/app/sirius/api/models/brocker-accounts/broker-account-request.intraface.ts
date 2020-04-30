import { BrokerAccountState } from './';
import { PagedRequest } from '../pagination/paged-request.interface';

export interface BrockerAccountRequest extends PagedRequest {
    id: string;
    name: string;
    state: BrokerAccountState;
}
