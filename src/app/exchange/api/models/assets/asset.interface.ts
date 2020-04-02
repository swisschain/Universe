export interface Asset {
    id: string;
    name: string;
    description: string;
    accuracy: number;
    isDisabled: boolean;
    created: Date;
    modified: Date;
}