import { VaultType, VaultStatus } from '../../api/models/vaults';

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

export function getVaultStatusTitle(vaultStatus: VaultStatus): string {
    switch (vaultStatus) {
        case VaultStatus.Offline:
            return 'Offline';
        case VaultStatus.Initializing:
            return 'Initializing';
        case VaultStatus.Activating:
            return 'Activating';
        case VaultStatus.Running:
            return 'Running';
        default:
            return '';
    }
}
