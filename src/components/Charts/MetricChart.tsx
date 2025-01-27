"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ComposedChart,
} from "recharts"

interface MetricChartProps {
    title: string
    data: any[]
    barKey?: string
    lineKey?: string
    xAxisKey?: string
    secondaryMetric?: {
        label?: string
        value: string
        activations?: string
    }
    timeFilters?: string[]
    onTimeFilterChange?: (filter: string) => void
    activeTimeFilter?: string
    yAxisPrefix?: string
    yAxisSuffix?: string
    height?: number
    barColor?: string
    lineColor?: string
}

export function MetricChart({
    title,
    data,
    barKey = "value",
    lineKey,
    xAxisKey = "name",
    secondaryMetric,
    timeFilters,
    onTimeFilterChange,
    activeTimeFilter,
    yAxisPrefix = "",
    yAxisSuffix = "",
    height = 300,
    barColor = "#E5E7EB", // Default gray color for bars
    lineColor = "#EC4899" // Default pink color for line
}: MetricChartProps) {
    return (
        <Card className="bg-white dark:bg-boxdark">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
                <div>
                    <CardTitle className="text-base font-medium">
                        {title}
                    </CardTitle>
                    {secondaryMetric && (
                        <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                Total Sales: {secondaryMetric.value}
                            </span>
                            <span className="text-sm text-pink-600 dark:text-pink-400">
                                Total Activation: {secondaryMetric.activations}
                            </span>
                        </div>
                    )}
                </div>
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
                <div style={{ height }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis
                                dataKey={xAxisKey}
                                stroke="#6B7280"
                                fontSize={12}
                            />
                            <YAxis
                                tickFormatter={(value) => `${yAxisPrefix}${value}${yAxisSuffix}`}
                                stroke="#6B7280"
                                fontSize={12}
                            />
                            <Tooltip
                                formatter={(value: number) => [`${yAxisPrefix}${value}${yAxisSuffix}`, ""]}
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '6px'
                                }}
                            />
                            <Bar
                                dataKey={barKey}
                                fill={barColor}
                                radius={[4, 4, 0, 0]}
                            />
                            {lineKey && (
                                <Line
                                    type="monotone"
                                    dataKey={lineKey}
                                    stroke={lineColor}
                                    strokeWidth={2}
                                    dot={{ fill: lineColor, strokeWidth: 2 }}
                                />
                            )}
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

