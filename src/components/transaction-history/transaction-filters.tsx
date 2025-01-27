'use client'

import { CalendarIcon } from 'lucide-react'
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { type TransactionHistoryFilters } from "@/types/transaction-history"
import { useState } from 'react'

interface TransactionFiltersProps {
    filters: TransactionHistoryFilters
    onFiltersChange: (filters: TransactionHistoryFilters) => void
}

export function TransactionFilters({
    filters,
    onFiltersChange
}: TransactionFiltersProps) {
    const [date, setDate] = useState<DateRange | undefined>({
        from: filters.dateRange?.from || addDays(new Date(), -30),
        to: filters.dateRange?.to || new Date(),
    })

    return (
        <div className="flex flex-wrap gap-4 mb-6">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={(newDate) => {
                            setDate(newDate)
                            if (newDate?.from && newDate?.to) {
                                onFiltersChange({
                                    ...filters,
                                    dateRange: {
                                        from: newDate.from,
                                        to: newDate.to
                                    }
                                })
                            }
                        }}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>

            <Select
                value={filters.status?.[0]}
                onValueChange={(value) =>
                    onFiltersChange({
                        ...filters,
                        status: value ? [value] : undefined
                    })
                }
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Success">Success</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={filters.types?.[0]}
                onValueChange={(value) =>
                    onFiltersChange({
                        ...filters,
                        types: value ? [value] : undefined
                    })
                }
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Credit Transfer">Credit Transfer</SelectItem>
                    <SelectItem value="Debit Transfer">Debit Transfer</SelectItem>
                    <SelectItem value="Incentive">Incentive</SelectItem>
                    <SelectItem value="Bonus">Bonus</SelectItem>
                    <SelectItem value="Commission">Commission</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

