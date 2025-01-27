import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { MetricValue } from "@/types/metrics"

interface MetricCardProps {
    title: string
    subtitle?: string
    value: string | number
    metrics?: Array<{
        value: number
        icon: 'T' | 'circle'
        color: 'green' | 'blue'
    }>
    className?: string
}

export function MetricCard({
    title,
    subtitle,
    value,
    metrics,
    className,
}: MetricCardProps) {
    const formatLargeNumber = (num: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num)
    }

    return (
        <Card className={cn("bg-white dark:bg-zinc-950 flex flex-col", className)}>
            <CardHeader className="flex-none pb-2">
                <CardTitle className="text-base font-normal text-zinc-600">
                    {title}
                </CardTitle>
                {subtitle && (
                    <CardDescription className="text-sm text-zinc-500">
                        {subtitle}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 space-y-4">
                    <div className="text-3xl font-bold text-zinc-900">
                        ${typeof value === 'number' ? formatLargeNumber(value) : value}
                    </div>
                    {metrics && metrics.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {metrics.map((metric, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-full",
                                        metric.color === 'green' ? "bg-emerald-100" : "bg-blue-100"
                                    )}
                                >
                                    <div className={cn(
                                        "flex items-center justify-center w-5 h-5 rounded-full",
                                        metric.color === 'green' ? "bg-emerald-500 text-white" : "bg-blue-500 text-white"
                                    )}>
                                        {metric.icon === 'T' ? 'T' : '○'}
                                    </div>
                                    <span className={cn(
                                        "text-sm font-medium",
                                        metric.color === 'green' ? "text-emerald-700" : "text-blue-700"
                                    )}>
                                        ${formatLargeNumber(metric.value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

