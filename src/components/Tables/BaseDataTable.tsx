'use client'

import { useState } from 'react'
import { Search, Calendar, Download, ChevronDown } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from "@/lib/utils"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'

export interface Column<T> {
    key: string
    label: string
    render?: (value: any, row: T) => React.ReactNode
}

interface BaseDataTableProps<T extends Record<string, any>> {
    data: T[]
    columns: Column<T>[]
    sortOptions: string[]
    onDownload?: () => void
    rowId: keyof T
    searchField: keyof T
    renderActions?: (row: T) => React.ReactNode
    className?: string
}

const ITEMS_PER_PAGE = 10

export function BaseDataTable<T extends Record<string, any>>({
    data,
    columns,
    sortOptions,
    onDownload,
    rowId,
    searchField,
    renderActions,
    className
}: BaseDataTableProps<T>) {
    const [filters, setFilters] = useState({
        search: '',
        sortBy: sortOptions[0],
        dateRange: undefined as { from: Date; to: Date } | undefined
    })
    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [date, setDate] = useState<{
        from: Date
        to: Date
    } | undefined>()

    const filteredData = data.filter(record => {
        if (filters.search && !String(record[searchField]).toLowerCase().includes(filters.search.toLowerCase())) {
            return false
        }

        if (filters.dateRange) {
            // Date filtering would be implemented based on specific needs
            return true
        }

        return true
    })

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const getPaginationRange = (currentPage: number, totalPages: number) => {
        const delta = 2; // Number of pages to show before and after current page
        const range: (number | string)[] = [];

        // Always show first page
        range.push(1);

        // Calculate start and end of range
        let start = Math.max(2, currentPage - delta);
        let end = Math.min(totalPages - 1, currentPage + delta);

        // Adjust range if close to edges
        if (currentPage <= delta + 1) {
            end = Math.min(totalPages - 1, delta * 2 + 1);
        } else if (currentPage >= totalPages - delta) {
            start = Math.max(2, totalPages - (delta * 2));
        }

        // Add ellipsis and range
        if (start > 2) {
            range.push('...');
        }
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        if (end < totalPages - 1) {
            range.push('...');
        }

        // Always show last page
        if (totalPages > 1) {
            range.push(totalPages);
        }

        return range;
    };

    return (
        <div className={cn("space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm", className)}>
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    <Input
                        placeholder="Search"
                        className="pl-9 bg-gray-50 border-gray-200 dark:bg-zinc-900 dark:border-zinc-700"
                        value={filters.search}
                        onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Sort By</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-[180px] justify-between bg-white border-gray-200 dark:bg-zinc-900 dark:border-zinc-700">
                                {filters.sortBy}
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[180px] bg-black border-gray-700">
                            {sortOptions.map((option) => (
                                <DropdownMenuItem
                                    key={option}
                                    onClick={() => setFilters(f => ({ ...f, sortBy: option }))}
                                    className="text-white hover:bg-gray-800"
                                >
                                    {option}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[180px] justify-between bg-white border-gray-200 dark:bg-zinc-900 dark:border-zinc-700">
                                Custom Date
                                <Calendar className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-black border-gray-700" align="end">
                            <CalendarComponent
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={(newDate: any) => {
                                    setDate(newDate)
                                    if (newDate?.from && newDate?.to) {
                                        setFilters(f => ({ ...f, dateRange: newDate }))
                                    }
                                }}
                                numberOfMonths={2}
                                className="bg-black"
                                classNames={{
                                    day_selected: "bg-rose-500 text-white hover:bg-rose-600",
                                    day_today: "bg-gray-800 text-white",
                                    day: "text-white hover:bg-gray-800",
                                    head_cell: "text-gray-400",
                                    cell: "text-gray-400",
                                    nav_button: "text-gray-400 hover:bg-gray-800",
                                    caption: "text-white"
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                    <Button onClick={onDownload} className="bg-rose-500 hover:bg-rose-600">
                        <Download className="h-4 w-4" />
                        Download
                    </Button>
                </div>
            </div>

            <div className="rounded-md border border-gray-200 dark:border-zinc-700">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-black hover:bg-black/90 dark:bg-black dark:hover:bg-black/90">
                            <TableHead className="w-[40px] text-white">
                                <Checkbox
                                    checked={selectedRows.length === paginatedData.length}
                                    onCheckedChange={(checked) => {
                                        setSelectedRows(checked ? paginatedData.map(r => String(r[rowId])) : [])
                                    }}
                                />
                            </TableHead>
                            {columns.map((column) => (
                                <TableHead key={column.key} className="text-white">
                                    {column.label}
                                </TableHead>
                            ))}
                            {renderActions && (
                                <TableHead className="w-[40px] text-white"></TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((record, index) => (
                            <TableRow
                                key={String(record[rowId])}
                                className={cn(
                                    "hover:bg-gray-50 dark:hover:bg-zinc-800/50",
                                    index % 2 === 1 ? "bg-gray-50 dark:bg-zinc-800/25" : "bg-white dark:bg-zinc-900"
                                )}
                            >
                                <TableCell>
                                    <Checkbox
                                        checked={selectedRows.includes(String(record[rowId]))}
                                        onCheckedChange={(checked) => {
                                            setSelectedRows(rows =>
                                                checked
                                                    ? [...rows, String(record[rowId])]
                                                    : rows.filter(id => id !== String(record[rowId]))
                                            )
                                        }}
                                    />
                                </TableCell>
                                {columns.map((column) => (
                                    <TableCell key={column.key}>
                                        {column.render ? column.render(record[column.key], record) : record[column.key]}
                                    </TableCell>
                                ))}
                                {renderActions && (
                                    <TableCell>
                                        {renderActions(record)}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedRows.length} row(s) selected
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="bg-white border-gray-200 dark:bg-zinc-900 dark:border-zinc-700"
                    >
                        Previous
                    </Button>

                    {getPaginationRange(currentPage, totalPages).map((page, index) => {
                        if (page === '...') {
                            return (
                                <span key={`ellipsis-${index}`} className="text-gray-500">
                                    ...
                                </span>
                            );
                        }

                        return (
                            <Button
                                key={page}
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Number(page))}
                                className={cn(
                                    currentPage === page
                                        ? "bg-rose-500 text-white hover:bg-rose-600 border-rose-500"
                                        : "bg-white border-gray-200 dark:bg-zinc-900 dark:border-zinc-700"
                                )}
                            >
                                {page}
                            </Button>
                        );
                    })}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="bg-white border-gray-200 dark:bg-zinc-900 dark:border-zinc-700"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

