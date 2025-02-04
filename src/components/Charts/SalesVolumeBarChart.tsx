"use client"

import React, { useState } from 'react'
import { Bar } from 'recharts'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ResponsiveContainer,
    BarChart,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts'

// Monthly data for 2024
const monthlyData2024 = [
    { name: 'Jan', value: 3741 },
    { name: 'Feb', value: 1587 },
    { name: 'Mar', value: 2085 },
    { name: 'Apr', value: 1664 },
    { name: 'May', value: 1809 },
    { name: 'Jun', value: 2536 },
    { name: 'Jul', value: 2303 },
    { name: 'Aug', value: 1718 },
    { name: 'Sep', value: 2354 },
    { name: 'Oct', value: 1914 },
    { name: 'Nov', value: 1848 },
    { name: 'Dec', value: 1831 }
]

// Monthly data for 2023
const monthlyData2023 = [
    { name: 'Jan', value: 2841 },
    { name: 'Feb', value: 1987 },
    { name: 'Mar', value: 2785 },
    { name: 'Apr', value: 1964 },
    { name: 'May', value: 2109 },
    { name: 'Jun', value: 2736 },
    { name: 'Jul', value: 2503 },
    { name: 'Aug', value: 1918 },
    { name: 'Sep', value: 2554 },
    { name: 'Oct', value: 2114 },
    { name: 'Nov', value: 2048 },
    { name: 'Dec', value: 2031 }
]

// Weekly data
const weeklyDataJan2024 = [
    { name: 'Week 1', value: 941 },
    { name: 'Week 2', value: 887 },
    { name: 'Week 3', value: 985 },
    { name: 'Week 4', value: 928 }
]

const weeklyDataFeb2024 = [
    { name: 'Week 1', value: 441 },
    { name: 'Week 2', value: 387 },
    { name: 'Week 3', value: 485 },
    { name: 'Week 4', value: 274 }
]

const SalesVolumeBarChart = () => {
    const [viewMode, setViewMode] = useState<'month' | 'year'>('year')
    const [selectedYear, setSelectedYear] = useState('2024')
    const [selectedMonth, setSelectedMonth] = useState('Jan')

    // Get data based on filters
    const getData = () => {
        if (viewMode === 'year') {
            return selectedYear === '2024' ? monthlyData2024 : monthlyData2023
        } else {
            return selectedMonth === 'Jan' ? weeklyDataJan2024 : weeklyDataFeb2024
        }
    }

    // Calculate total
    const total = getData().reduce((sum, item) => sum + item.value, 0)

    const CustomBarLabel = ({ x, y, width, value }: any) => {
        return (
            <text
                x={x + width / 2}
                y={y - 10}
                fill="#64748B"
                textAnchor="middle"
                fontSize={12}
            >
                ${value}
            </text>
        )
    }

    return (
        <Card className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 px-0">
                <div className="space-y-4">
                    <CardTitle className="text-2xl font-semibold text-black dark:text-white">
                        Sales Volume
                    </CardTitle>
                    <div className="text-4xl font-bold text-black dark:text-white">
                        ${(total / 1000).toFixed(3)}K
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Year Filter */}
                    <Select
                        value={selectedYear}
                        onValueChange={setSelectedYear}
                    >
                        <SelectTrigger className="w-[100px] bg-transparent border-stroke">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 rounded-md bg-whiter p-1 dark:bg-meta-4">
                        <button
                            onClick={() => setViewMode('month')}
                            className={`rounded-md px-3 py-1 text-sm ${viewMode === 'month'
                                ? 'bg-primary text-white'
                                : 'bg-white text-black dark:bg-boxdark dark:text-white'
                                }`}


                        >
                            Month
                        </button>
                        <button
                            onClick={() => setViewMode('year')}
                            className={`rounded-md px-3 py-1 text-sm ${viewMode === 'year'
                                ? 'bg-primary text-white'
                                : 'bg-white text-black dark:bg-boxdark dark:text-white'
                                }`}
                        >
                            Year
                        </button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-0">
                {/* Month Selector (only shown in month view) */}
                {viewMode === 'month' && (
                    <div className="mb-6">
                        <Select
                            value={selectedMonth}
                            onValueChange={setSelectedMonth}
                        >
                            <SelectTrigger className="w-[200px] bg-transparent border-stroke">
                                <SelectValue placeholder="Select Month" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Jan">January 2024</SelectItem>
                                <SelectItem value="Feb">February 2024</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={getData()}
                            margin={{ top: 40, right: 0, left: 0, bottom: 0 }}
                            barSize={40}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#E2E8F0"
                            />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                fontSize={12}
                                tickMargin={12}
                                stroke="#64748B"
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                fontSize={12}
                                tickCount={7}
                                tickFormatter={(value) => `$${value}`}
                                tickMargin={12}
                                stroke="#64748B"
                                domain={[0, 6000]}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                                formatter={(value: number) => [`$${value}`, 'Sales']}
                            />
                            <Bar
                                dataKey="value"
                                fill="#94A3B8"
                                radius={[0, 0, 0, 0]}
                                label={CustomBarLabel}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default SalesVolumeBarChart