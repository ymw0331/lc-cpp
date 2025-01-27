"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
} from "recharts"

interface DualLineMetricChartProps {
    title: string
    data: any[]
    primaryKey: string
    secondaryKey: string
    xAxisKey?: string
    metrics?: {
        primary: { label: string; value: string }
        secondary: { label: string; value: string }
    }
    timeFilters?: string[]
    onTimeFilterChange?: (filter: string) => void
    activeTimeFilter?: string
    height?: number
    primaryColor?: string
    secondaryColor?: string
}

export function DualLineMetricChart({
    title,
    data,
    primaryKey,
    secondaryKey,
    xAxisKey = "name",
    metrics,
    timeFilters,
    onTimeFilterChange,
    activeTimeFilter,
    height = 300,
    primaryColor = "#F97316", // Orange for agents
    secondaryColor = "#EC4899" // Pink for partners
}: DualLineMetricChartProps) {
    return (
        <Card className="bg-white dark:bg-boxdark">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
                <div>
                    <CardTitle className="text-base font-medium">
                        {title}
                    </CardTitle>
                    {metrics && (
                        <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-zinc-600">
                                {metrics.primary.label}: {metrics.primary.value}
                            </span>
                            <span className="text-sm text-pink-600">
                                {metrics.secondary.label}: {metrics.secondary.value}
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
                                className={`
                  ${activeTimeFilter === filter
                                        ? "bg-pink-600 hover:bg-pink-700 text-white"
                                        : "bg-zinc-200 hover:bg-zinc-300 text-zinc-600"}
                  rounded-md px-4 py-1 text-sm font-medium
                `}
                            >
                                {filter}
                            </Button>
                        ))}
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div style={{ height, width: '100%' }}>
                    <ResponsiveContainer>
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                horizontal={true}
                                vertical={false}
                                stroke="#E5E7EB"
                            />
                            <XAxis
                                dataKey={xAxisKey}
                                axisLine={false}
                                tickLine={false}
                                stroke="#6B7280"
                                fontSize={12}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                stroke="#6B7280"
                                fontSize={12}
                                tickCount={7}
                                domain={[0, 'dataMax + 100']}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '6px',
                                    fontSize: '12px'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey={primaryKey}
                                stroke={primaryColor}
                                strokeWidth={2}
                                dot={{ r: 4, fill: primaryColor }}
                                activeDot={{ r: 6, fill: primaryColor }}
                            />
                            <Line
                                type="monotone"
                                dataKey={secondaryKey}
                                stroke={secondaryColor}
                                strokeWidth={2}
                                dot={{ r: 4, fill: secondaryColor }}
                                activeDot={{ r: 6, fill: secondaryColor }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

