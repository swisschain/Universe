import { WalletType } from './wallet-type.enum';

export interface Wallet {
    id: number;
    accountId: number;
    name: string;
    type: WalletType;
    isEnabled: boolean;
    created: Date;
    modified: Date;
}
