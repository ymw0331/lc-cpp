"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

interface DataPoint {
    label: string;
    value: number;
}

type TimeRange = 'Week' | 'Month' | 'Year';
type FilterType = 'Simple' | 'Detailed';

interface TimeRangeData {
    [key: string]: {
        Week?: DataPoint[];
        Month: DataPoint[];
        Year: DataPoint[];
    };
}

interface MetricsChartProps {
    title: string;
    amount: string | number;
    data: TimeRangeData;
    filterType?: FilterType;
    barColor?: string;
    alternateBarColor?: string;
    prefix?: string;
    suffix?: string;
    height?: number;
    valueFormatter?: (value: number) => string;
    className?: string;
}

const MetricsChart = ({
    title,
    amount,
    data,
    filterType = 'Simple',
    barColor = '#3B82F6',
    alternateBarColor,
    prefix = '',
    suffix = '',
    height = 300,
    valueFormatter,
    className = '',
}: MetricsChartProps) => {
    const [activeYear, setActiveYear] = useState<string>(
        Object.keys(data)[0]
    );
    // const [activeRange, setActiveRange] = useState<TimeRange>('Month');

    const [activeRange, setActiveRange] = useState<TimeRange>(() => {
        // Initialize with Month if Week data doesn't exist
        return data[Object.keys(data)[0]].Week ? 'Month' : 'Month';
    });

    const availableRanges = (): TimeRange[] => {
        const hasWeekData = data[activeYear]?.Week && data[activeYear]?.Week?.length > 0;
        return hasWeekData 
            ? ['Week', 'Month', 'Year'] 
            : ['Month', 'Year'];
    };

    const [chartData, setChartData] = useState<DataPoint[]>([]);


    useEffect(() => {
        const newData = data[activeYear][activeRange] || [];
        setChartData(newData);
    }, [activeYear, activeRange, data]);


    const formatValue = (value: number): string => {
        if (valueFormatter) return valueFormatter(value);
        return `${prefix}${value.toLocaleString()}${suffix}`;
    };

    const CustomBar = (props: any) => {
        const { x, y, width, height: barHeight, index } = props;
        const fill = alternateBarColor ?
            (index % 2 === 0 ? barColor : alternateBarColor) :
            barColor;

        return (
            <rect
                x={x}
                y={y}
                width={width}
                height={barHeight}
                fill={fill}
                rx={6}
                ry={6}
            />
        );
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload?.[0]) {
            return (
                <div className="bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded-lg shadow-lg p-3">
                    <p className="font-medium text-black dark:text-white">
                        {formatValue(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className={`w-full bg-white dark:bg-boxdark border border-stroke dark:border-strokedark ${className}`}>
            <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-6">
                <div>
                    <CardTitle className="text-2xl font-semibold text-black dark:text-white">
                        {title}
                    </CardTitle>
                    <p className="text-4xl font-bold mt-2 text-black dark:text-white">
                        {formatValue(Number(amount))}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {filterType === 'Detailed' && Object.keys(data).length > 1 && (
                        <Select
                            value={activeYear}
                            onValueChange={setActiveYear}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(data).map((year) => (
                                    <SelectItem key={year} value={year}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    <div className="flex space-x-2 bg-gray-100 dark:bg-meta-4 p-1 rounded-full">
                        {(['Week', 'Month', 'Year'] as TimeRange[]).map((range) => (
                            <Button
                                key={range}
                                variant={activeRange === range ? "default" : "ghost"}
                                onClick={() => setActiveRange(range)}
                                className={`rounded-full px-6 transition-all duration-200 ${activeRange === range
                                        ? "bg-primary text-white hover:bg-primary/90"
                                        : "text-black dark:text-white hover:bg-meta-4/50"
                                    }`}
                            >
                                {range}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div style={{ height: `${height}px`, width: '100%' }}>
                    <ResponsiveContainer width="100%" height={height}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
                            className="text-black dark:text-white"
                        >
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'currentColor', fontSize: 12 }}
                                dy={10}
                                height={60}
                                angle={-45}
                                textAnchor="end"
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'currentColor', fontSize: 12 }}
                                width={80}
                                tickFormatter={(value) => value.toLocaleString()}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: 'transparent' }}
                            />
                            <Bar
                                dataKey="value"
                                barSize={40}
                                shape={<CustomBar />}
                                isAnimationActive={false}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default MetricsChart;