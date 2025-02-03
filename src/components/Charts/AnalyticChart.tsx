'use client';

import { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Period = 'Week' | 'Month' | 'Year';

interface ChartData {
    name: string;
    value: number;
}

interface AnalyticChartProps {
    title: string;
    chartData: {
        Week: ChartData[];
        Month: ChartData[];
        Year: ChartData[];
    };
    legendLabel?: string;
    showLegend?: boolean;
    legendPosition?: 'top-right' | 'bottom-right';
    lineColor?: string;
    className?: string;
}

const AnalyticChart = ({ 
    title, 
    chartData,
    legendLabel,
    showLegend = false,
    legendPosition = 'top-right',
    lineColor = '#F69732',
    className
}: AnalyticChartProps) => {
    const [activePeriod, setActivePeriod] = useState<Period>('Year');

    const activeData = chartData[activePeriod];
    const allValues = activeData.map(d => d.value);
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    
    const stepSize = 500;
    const yAxisMax = Math.ceil(maxValue / stepSize) * stepSize;
    const yAxisMin = Math.floor(minValue / stepSize) * stepSize;

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-boxdark dark:bg-boxdark p-3 rounded-sm shadow-md border border-stroke dark:border-strokedark">
                    <p className="text-white text-sm font-medium">
                        {payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomLegend = () => {
        if (!showLegend || !legendLabel) return null;
        
        return (
            <div className={cn(
                "flex items-center",
                legendPosition === 'top-right' ? "justify-end mb-4" : "justify-end mt-2"
            )}>
                <div className="flex items-center gap-2">
                    <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: lineColor }}
                    />
                    <span className="text-sm text-body dark:text-bodydark">
                        {legendLabel}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className={cn("p-6 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark", className)}>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h4 className="text-2xl font-bold text-black dark:text-white mb-4">
                        {title}
                    </h4>
                </div>

                <div className="flex gap-2">
                    {(['Week', 'Month', 'Year'] as Period[]).map((period) => (
                        <Button
                            key={period}
                            variant={activePeriod === period ? "default" : "outline"}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm",
                                activePeriod === period 
                                    ? "bg-primary hover:bg-primary/90 text-white" 
                                    : "bg-gray-2 dark:bg-meta-4 hover:bg-gray-3"
                            )}
                            onClick={() => setActivePeriod(period)}
                        >
                            {period}
                        </Button>
                    ))}
                </div>
            </div>

            {showLegend && legendPosition === 'top-right' && <CustomLegend />}

            <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData[activePeriod]}
                        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="5 5"
                            vertical={false}
                            stroke="rgba(226, 232, 240, 0.5)"
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748B', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748B', fontSize: 12 }}
                            domain={[yAxisMin, yAxisMax]}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={lineColor}
                            strokeWidth={2}
                            dot={{
                                r: 4,
                                fill: lineColor,
                                stroke: '#fff',
                                strokeWidth: 2,
                            }}
                            activeDot={{
                                r: 6,
                                fill: lineColor,
                                stroke: '#fff',
                                strokeWidth: 2,
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {showLegend && legendPosition === 'bottom-right' && <CustomLegend />}
        </div>
    );
};

export default AnalyticChart;