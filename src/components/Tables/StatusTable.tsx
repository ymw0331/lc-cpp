"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface TimeFilter {
    label: string
    value: string
}

interface Column {
    key: string
    label: string
    render?: (value: any) => React.ReactNode
}

interface StatusTableProps {
    title: string
    data: Array<Record<string, any>>
    columns: Column[]
    timeFilters?: TimeFilter[]
    activeTimeFilter?: string
    onTimeFilterChange?: (value: string) => void
    statusStyles?: Record<string, string>
    className?: string
}

export function StatusTable({
    title,
    data,
    columns,
    timeFilters,
    activeTimeFilter,
    onTimeFilterChange,
    statusStyles = {
        Pending: "bg-yellow-100 text-yellow-800",
        Success: "bg-emerald-100 text-emerald-800",
        Failed: "bg-red-100 text-red-800"
    },
    className
}: StatusTableProps) {
    return (
        <Card className={cn("bg-white dark:bg-zinc-950", className)}>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-medium">{title}</CardTitle>
                {timeFilters && (
                    <div className="flex gap-2">
                        {timeFilters.map((filter) => (
                            <Button
                                key={filter.value}
                                variant={activeTimeFilter === filter.value ? "default" : "outline"}
                                size="sm"
                                onClick={() => onTimeFilterChange?.(filter.value)}
                                className={cn(
                                    activeTimeFilter === filter.value && "bg-rose-600 hover:bg-rose-700"
                                )}
                            >
                                {filter.label}
                            </Button>
                        ))}
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="bg-black">
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column.key} className="text-white font-medium">
                                    {column.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index} className={index % 2 === 1 ? "bg-zinc-50" : undefined}>
                                {columns.map((column) => (
                                    <TableCell key={column.key}>
                                        {column.render ? column.render(row[column.key]) : row[column.key]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

