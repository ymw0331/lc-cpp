'use client'

import { MoreVertical } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BaseDataTable, type Column } from './BaseDataTable'
import { type PayoutRecord, type PayoutStatus } from '@/types/payout'


const sortOptions = [
    'All',
    'Latest Date',
    'Await',
    'Approved',
    'Pending',
    'Low to High Amt',
    'High to Low Amt',
]

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount)
}

const getStatusColor = (status: PayoutStatus) => {
    switch (status) {
        case 'Approved':
            return 'text-emerald-600 dark:text-emerald-400'
        case 'Pending':
            return 'text-yellow-600 dark:text-yellow-400'
        case 'Decline':
            return 'text-red-600 dark:text-red-400'
        default:
            return 'text-gray-600 dark:text-gray-400'
    }
}

interface PayoutTableProps {
    data: PayoutRecord[]
    onStatusChange?: (id: string, status: PayoutStatus) => void
    onDownload?: () => void
}

export function PayoutTable({
    data,
    onStatusChange,
    onDownload
}: PayoutTableProps) {
    const columns: Column<PayoutRecord>[] = [
        {
            key: 'userId',
            label: 'User ID'
        },
        {
            key: 'name',
            label: 'Name',
            render: (value, row) => (
                <div>
                    <div>{value}</div>
                    <div className="text-sm text-gray-500">{row.email}</div>
                </div>
            )
        },
        {
            key: 'rank',
            label: 'RANK'
        },
        {
            key: 'description',
            label: 'Description'
        },
        {
            key: 'date',
            label: 'Date',
            render: (value) => format(new Date(value), 'dd MMM yyyy')
        },
        {
            key: 'transactionId',
            label: 'Transaction ID'
        },
        {
            key: 'amount',
            label: 'Payout (USD)',
            render: (value) => formatCurrency(value)
        },
        {
            key: 'status',
            label: 'STATUS',
            render: (value) => (
                <span className={cn("font-medium", getStatusColor(value as PayoutStatus))}>
                    {value}
                </span>
            )
        }
    ]

    const renderActions = (row: PayoutRecord) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black border-gray-700">
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                    View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => onStatusChange?.(row.id, 'Approved')}
                    className="text-white hover:bg-gray-800"
                >
                    Approved
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => onStatusChange?.(row.id, 'Pending')}
                    className="text-white hover:bg-gray-800"
                >
                    Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => onStatusChange?.(row.id, 'Decline')}
                    className="text-white hover:bg-gray-800"
                >
                    Decline
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )

    return (
        <BaseDataTable
            data={data}
            columns={columns}
            sortOptions={sortOptions}
            onDownload={onDownload}
            rowId="id"
            searchField="name"
            renderActions={renderActions}
        />
    )
}

