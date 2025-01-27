'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import DefaultLayout from "@/components/Layouts/DefaultLayout"
import { TransactionHistoryTable } from "@/components/Tables/TransactionHistoryTable"
import { TransactionFilters } from "@/components/transaction-history/transaction-filters"
import { Card } from "@/components/ui/card"
import { Transaction, TransactionHistoryFilters } from "@/types/transaction-history"
import { useState } from "react"


// Sample data - in a real app this would come from an API
const transactions: Transaction[] = [
    {
        id: '1',
        date: '2024-01-10T10:00:00',
        types: ['Credit Transfer', 'Incentive', 'Bonus', 'Commission', 'Referral'],
        amount: 2355.23,
        status: 'Success'
    },
    {
        id: '2',
        date: '2024-01-09T15:30:00',
        types: ['Debit Transfer', 'Withdrawal', 'Fee', 'Service Charge'],
        amount: -1250.00,
        status: 'Pending'
    },
    // Add more sample transactions...
]


const TransactionHistoryPage = () => {
    const [filters, setFilters] = useState<TransactionHistoryFilters>({})

    // In a real app, this would be handled by the backend
    const filteredTransactions = transactions.filter(transaction => {
        if (filters.dateRange) {
            const transactionDate = new Date(transaction.date)
            if (
                transactionDate < filters.dateRange.from ||
                transactionDate > filters.dateRange.to
            ) {
                return false
            }
        }

        if (filters.types?.length) {
            if (!transaction.types.some(type => filters.types?.includes(type))) {
                return false
            }
        }

        if (filters.status?.length) {
            if (!filters.status.includes(transaction.status)) {
                return false
            }
        }

        return true
    })


    return (
        <DefaultLayout>
            <Breadcrumb pageName="Transaction History" />

            <Card className="p-6">
                <TransactionFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                />

                <TransactionHistoryTable
                    transactions={filteredTransactions}
                />
            </Card>

        </DefaultLayout>
    )
}

export default TransactionHistoryPage