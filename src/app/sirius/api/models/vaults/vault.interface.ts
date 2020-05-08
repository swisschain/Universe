import { VaultType } from './vault-type.enum';

export interface Vault {
    id: number,
    name: string,
    type: VaultType,
    createdAt: Date;
    updatedAt: Date;
}
