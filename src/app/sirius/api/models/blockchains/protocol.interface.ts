import { Requirements } from './requirements.interface';
import { Capabilities } from './capabilities.interface';

export interface Protocol {
    code: string;
    name: string;
    startBlockNumber: number;
    requirements: Requirements;
    capabilities: Capabilities;
}
