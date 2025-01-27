"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer } from "recharts"

interface SparklineData {
    name: string
    value: number
}

interface StatCardProps {
    title: string
    value: string
    description?: string
    metric?: {
        value: string
        trend: 'up' | 'down'
    }
    todayValue?: string
    sparklineData?: SparklineData[]
    valuePrefix?: string
    valueSuffix?: string
    trendColor?: string
    sparklineColor?: string
}


export const AdminStatCard = ({
    title,
    value,
    description,
    metric,
    todayValue,
    sparklineData,
    valuePrefix = "",
    valueSuffix = "",
    trendColor = "#10B981", // Default green color
    sparklineColor = "#EC4899" // Default pink color for the sparkline
}: StatCardProps) => {
    return (
        <Card className="bg-white dark:bg-boxdark">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        {title}
                    </CardTitle>
                    {description && (
                        <CardDescription className="text-xs text-zinc-500 dark:text-zinc-500">
                            {description}
                        </CardDescription>
                    )}
                </div>
                {metric && (
                    <div
                        style={{ color: trendColor }}
                        className="text-xs font-medium"
                    >
                        {metric.trend === 'up' ? '↑' : '↓'} {metric.value}
                    </div>
                )}
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {valuePrefix}{value}{valueSuffix}
                </div>
                {todayValue && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            Total Today
                        </span>
                        <span className="text-sm font-medium text-orange-500">
                            {valuePrefix}{todayValue}
                        </span>
                    </div>
                )}
                {sparklineData && (
                    <div className="h-[40px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sparklineData}>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={sparklineColor}
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}