export interface ApiKey {
    id: number;
    vaultId: number;
    name: string;
    expiresAt: Date;
    issuedAt: Date;
    isRevoked: boolean;
}
