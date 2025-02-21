export type StatusType = 'SUCCEED' | 'FAILED';

export type CurrencyType = 'USDT' | 'USDC';

export interface TransferActivityProps {
    id: string;
    amount: number;
    currency: CurrencyType;
    dateTime: string;
    status: StatusType;
}
