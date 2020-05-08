import { VaultType } from '../../api/models/vaults';

export function getVaultTypeTitle(vaultType: VaultType): string {
    switch (vaultType) {
        case VaultType.Private:
            return 'Private';
        case VaultType.Shared:
            return 'Shared';
        default:
            return '';
    }
}