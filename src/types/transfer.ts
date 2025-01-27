export interface TransferFormData {
    transferType: 'credit' | 'debit'
    recipient: {
        email: string
        name?: string
        userId?: string
        walletAddress?: string
    }
    walletType: 'current' | 'credit' | 'reward'
    amount: string
    transferFee: string
    totalAmount: string
    description: string
    note: string
}

export interface TransferType {
    id: 'credit' | 'debit'
    label: string
    recipientLabel: string
    walletLabel: string
    feeLabel: string
}

export interface WalletType {
    id: 'current' | 'credit' | 'reward'
    label: string
    balance?: string
}