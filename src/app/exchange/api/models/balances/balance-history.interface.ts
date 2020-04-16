export interface BalanceHistory {
    id: number;
    walletId: string;
    assetId: string;
    balance: string;
    oldBalance: string;
    reserved: string;
    oldReserved: string;
    timestamp: Date;
}