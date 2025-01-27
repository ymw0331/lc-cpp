"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface MetricCardWithChartProps {
    title: string
    subtitle?: string
    value: string | number
    comparison?: {
        value: number
        label: string
    }
    chartData: Array<{
        name: string
        payout: number
        revenue: number
    }>
    className?: string
}

export function MetricCardWithChart({
    title,
    subtitle,
    value,
    comparison,
    chartData,
    className,
}: MetricCardWithChartProps) {
    const formatLargeNumber = (num: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num)
    }

    const formatYAxis = (value: number) => {
        if (value >= 1000000) return `$${value / 1000000}M`
        if (value >= 1000) return `$${value / 1000}K`
        return `$${value}`
    }

    return (
        <Card className={cn("bg-white dark:bg-zinc-950 flex flex-col", className)}>
            <div className="flex flex-col md:flex-row flex-1">
                <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-zinc-200 flex flex-col">
                    <div className="flex-none space-y-1 mb-4">
                        <h3 className="text-base font-normal text-zinc-600">{title}</h3>
                        {subtitle && (
                            <p className="text-sm text-zinc-500">{subtitle}</p>
                        )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                        <div className="text-3xl font-bold text-zinc-900">
                            ${typeof value === 'number' ? formatLargeNumber(value) : value}
                        </div>
                        {comparison && (
                            <div className="flex flex-col gap-1">
                                <div className="text-sm text-zinc-600">
                                    {comparison.label}
                                </div>
                                <div className="inline-flex items-center w-fit rounded-full px-2 py-0.5 text-sm bg-rose-100">
                                    <span className="text-rose-600">{comparison.value}%</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-[2] p-6 flex flex-col">
                    <div className="flex-none flex justify-between items-center mb-4">
                        <h4 className="text-base font-medium">Monthly</h4>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                <span>Payout ${formatLargeNumber(chartData[chartData.length - 1].payout)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-rose-200"></span>
                                <span>Revenue ${formatLargeNumber(chartData[chartData.length - 1].revenue)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    fontSize={12}
                                    tick={{ fill: '#6B7280' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    fontSize={12}
                                    tick={{ fill: '#6B7280' }}
                                    tickFormatter={formatYAxis}
                                />
                                <Tooltip
                                    formatter={(value: number) => [`$${formatLargeNumber(value)}`, ""]}
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '6px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Bar
                                    dataKey="payout"
                                    fill="#EC4899"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="revenue"
                                    fill="#FBCFE8"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </Card>
    )
}

