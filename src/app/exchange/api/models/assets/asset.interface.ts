export interface Asset {
    symbol: string;
    description: string;
    accuracy: number;
    isDisabled: boolean;
    created: Date;
    modified: Date;
}