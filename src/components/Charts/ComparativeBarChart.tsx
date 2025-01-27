"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { cn } from "@/lib/utils"

interface TimeFilter {
  label: string
  value: string
}

interface ComparativeBarChartProps {
  title: string
  data: Array<{
    name: string
    [key: string]: string | number
  }>
  primaryMetric: {
    key: string
    label: string
    value: string | number
    color: string
  }
  secondaryMetric: {
    key: string
    label: string
    value: string | number
    color: string
  }
  timeFilters: TimeFilter[]
  activeTimeFilter: string
  onTimeFilterChange: (value: string) => void
  valuePrefix?: string
  className?: string
}

export function ComparativeBarChart({
  title,
  data,
  primaryMetric,
  secondaryMetric,
  timeFilters,
  activeTimeFilter,
  onTimeFilterChange,
  valuePrefix = "",
  className
}: ComparativeBarChartProps) {
  const formatLargeNumber = (value: number) => {
    if (value >= 1000000) return `${valuePrefix}${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${valuePrefix}${(value / 1000).toFixed(1)}K`
    return `${valuePrefix}${value.toFixed(0)}`
  }

  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  return (
    <Card className={cn("bg-white dark:bg-boxdark", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <div className="space-y-4">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryMetric.color }}></span>
              <span>{primaryMetric.label} {formatTooltipValue(Number(primaryMetric.value))}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: secondaryMetric.color }}></span>
              <span>{secondaryMetric.label} {formatTooltipValue(Number(secondaryMetric.value))}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {timeFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={activeTimeFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => onTimeFilterChange(filter.value)}
              className={cn(
                activeTimeFilter === filter.value && "bg-rose-600 hover:bg-rose-700"
              )}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280' }}
                tickFormatter={formatLargeNumber}
              />
              <Tooltip
                formatter={(value: number) => [formatTooltipValue(value)]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Bar
                dataKey={primaryMetric.key}
                fill={primaryMetric.color}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey={secondaryMetric.key}
                fill={secondaryMetric.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

