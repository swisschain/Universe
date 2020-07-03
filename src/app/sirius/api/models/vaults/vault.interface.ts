import { VaultType } from './vault-type.enum';
import { VaultStatus } from './vault-status.enum';

export interface Vault {
    id: number;
    name: string;
    type: VaultType;
    status: VaultStatus;
    createdAt: Date;
    updatedAt: Date;
}
