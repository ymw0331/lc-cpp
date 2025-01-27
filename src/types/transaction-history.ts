export interface Transaction {
    id: string
    date: string
    types: string[]
    amount: number
    status: 'Pending' | 'Success' | 'Failed'
}

export interface TransactionHistoryFilters {
    dateRange?: {
        from: Date
        to: Date
    }
    types?: string[]
    status?: string[]
}

