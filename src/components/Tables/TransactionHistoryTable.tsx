'use client'

import { format } from "date-fns"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { type Transaction } from "@/types/transaction-history"

interface TransactionHistoryTableProps {
    transactions: Transaction[]
}

export function TransactionHistoryTable({
    transactions
}: TransactionHistoryTableProps) {
    const formatCurrency = (amount: number) => {
        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(Math.abs(amount))
        return `${amount < 0 ? '- ' : '+ '}${formatted}`
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-black hover:bg-black/90">
                    <TableHead className="text-white font-medium">Date</TableHead>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <TableHead key={i} className="text-white font-medium">Type</TableHead>
                    ))}
                    <TableHead className="text-white font-medium">Amount</TableHead>
                    <TableHead className="text-white font-medium">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-zinc-50">
                        <TableCell>
                            {format(new Date(transaction.date), 'MMM dd, yyyy HH:mm')}
                        </TableCell>
                        {[0, 1, 2, 3, 4].map((i) => (
                            <TableCell key={i}>
                                {transaction.types[i] || ''}
                            </TableCell>
                        ))}
                        <TableCell className={cn(
                            "font-medium",
                            transaction.amount < 0 ? "text-red-600" : "text-emerald-600"
                        )}>
                            {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>
                            <Badge variant={
                                transaction.status === 'Success' ? 'default' :  // Changed 'success' to 'default'
                                    transaction.status === 'Pending' ? 'secondary' :  // Changed 'warning' to 'secondary'
                                        'destructive'
                            }
                                className={
                                    transaction.status === 'Success' ? 'bg-green-500 hover:bg-green-600' :  // Add custom colors
                                        transaction.status === 'Pending' ? 'bg-yellow-500 hover:bg-yellow-600' :  // Add custom colors
                                            ''
                                }>
                                {transaction.status}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

