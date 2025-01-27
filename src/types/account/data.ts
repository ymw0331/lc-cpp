/*** Account Stats ***/

export type CurrencyType = 'USDT' | 'USDC';
export type StatusType = 'SUCCEED' | 'FAILED';

export interface TransferActivityProps {
    id: string;
    amount: number;
    currency: CurrencyType;
    dateTime: string;
    status: StatusType;
}
