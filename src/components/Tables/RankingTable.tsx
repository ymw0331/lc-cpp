"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface RankingTableProps {
    title: string
    data: Array<Record<string, string | number>>
    columns: Array<{
        key: string
        label: string
        format?: (value: any) => string
    }>
    timeFilters?: string[]
    activeTimeFilter?: string
    onTimeFilterChange?: (filter: string) => void
}

export function RankingTable({
    title,
    data,
    columns,
    timeFilters,
    activeTimeFilter,
    onTimeFilterChange
}: RankingTableProps) {
    return (
        <Card className="bg-white dark:bg-boxdark">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-base font-medium">{title}</CardTitle>
                {timeFilters && (
                    <div className="flex gap-2">
                        {timeFilters.map((filter) => (
                            <Button
                                key={filter}
                                variant={activeTimeFilter === filter ? "default" : "outline"}
                                size="sm"
                                onClick={() => onTimeFilterChange?.(filter)}
                                className={activeTimeFilter === filter ?
                                    "bg-pink-600 hover:bg-pink-700 text-white" :
                                    "text-zinc-600 hover:text-zinc-900"}
                            >
                                {filter}
                            </Button>
                        ))}
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-black hover:bg-black/90">
                            {columns.map((column) => (
                                <TableHead key={column.key} className="text-white font-medium">
                                    {column.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index} className="hover:bg-zinc-50 dark:hover:bg-zinc-800">
                                {columns.map((column) => (
                                    <TableCell key={column.key} className="text-zinc-900 dark:text-zinc-100">
                                        {column.format ? column.format(row[column.key]) : row[column.key]}
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

