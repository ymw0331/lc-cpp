export interface MetricValue {
    value: string | number
    label?: string
    icon?: string
    variant?: 'default' | 'success' | 'warning' | 'error'
}

export interface TimeSeriesData {
    name: string
    value: number
    secondaryValue?: number
}

export interface ComparisonData {
    value: number
    trend: 'up' | 'down'
    label: string
}

