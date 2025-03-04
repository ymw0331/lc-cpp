// transfer.types.ts
export type StatusType = 'SUCCEED' | 'FAILED';

export type CurrencyType = 'USDT' | 'USDC';

export type TransferType = 'transfer-in' | 'transfer-out';

export interface TransferActivityProps {
    id: string;
    description?: string;
    amount: number;
    currency: CurrencyType;
    dateTime: string;
    status: string;
    type: TransferType;
}

// Define the transaction type from dashboard API
export interface WalletTransaction {
    id: string;
    fromEntity: string;
    toEntity: string;
    currency: CurrencyType;
    fromId: string;
    toId: string;
    metadata: Record<string, any>;
    amount: number;
    description: string;
    accountId: string;
    createdAt: string;
    tx_hash: string | null;
}

export interface CurrencyOption {
    name: CurrencyType;
    symbol: CurrencyType;
}

export interface WalletBalanceDistribution {
    data: Array<{
        name: string;
        value: number;
    }>;
}

export interface TransferDataResponse {
    sourceWallet: {
        amount: number;
        currency: CurrencyType;
    };
    currencyOptions: CurrencyOption[];
    walletBalanceDistribution: WalletBalanceDistribution;
    transferActivity: TransferActivityProps[];
}