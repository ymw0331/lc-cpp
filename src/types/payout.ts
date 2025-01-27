export type PayoutStatus = 'Await' | 'Approved' | 'Pending' | 'Decline'
export type SortByOption = 'All' | 'Latest Date' | 'Await' | 'Approved' | 'Pending' | 'Low to High Amt' | 'High to Low Amt'

export interface PayoutRecord {
    id: string
    userId: string
    name: string
    email: string
    rank: string
    description: string
    date: string
    transactionId: string
    amount: number
    status: PayoutStatus
}

export interface PayoutFilters {
    search?: string
    sortBy?: SortByOption
    dateRange?: {
        from: Date
        to: Date
    }
}
