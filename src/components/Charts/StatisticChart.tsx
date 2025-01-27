"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { ChartDataPoint, CurrencyType } from "@/types/dashboard/data";
import { depositChartData } from "@/lib/dashboard/data";

interface StatisticChartProps {
    title: string;
    total: number;
    currency: CurrencyType;
}

const StatisticChart: React.FC<StatisticChartProps> = ({
    title,
    total,
    currency
}) => {
    const [activeRange, setActiveRange] = useState<"Week" | "Month" | "Year">("Year");
    const [chartData, setChartData] = useState<ChartDataPoint[]>(depositChartData["Year"]);

    const handleRangeChange = (range: "Week" | "Month" | "Year") => {
        setActiveRange(range);
        setChartData(depositChartData[range]);
    };

    const formatValue = (value: number) => {
        return `${value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })} ${currency}`;
    };

    const getBarColor = (_: any, index: number) => {
        return `var(--chart-${index % 2 === 0 ? 'primary' : 'secondary'})`;
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

    const CustomBar = (props: any) => {
        const { x, y, width, height, index } = props;
        return (
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={index % 2 === 0 ? "#7C74FF" : "#E9E7FD"} // Direct color application
                rx={6}
                ry={6}
            />
        );
    };

    return (
        <Card className="w-full bg-white dark:bg-boxdark border border-stroke dark:border-strokedark">
            <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-6">
                <div>
                    <CardTitle className="text-2xl font-semibold text-black dark:text-white">
                        {title}
                    </CardTitle>
                    <p className="text-4xl font-bold mt-2 text-black dark:text-white">
                        {formatValue(total)}
                    </p>
                </div>

                <div className="flex space-x-2 bg-gray-100 dark:bg-meta-4 p-1 rounded-full">
                    {["Week", "Month", "Year"].map((range) => (
                        <Button
                            key={range}
                            variant={activeRange === range ? "default" : "ghost"}
                            className={`rounded-full px-6 transition-all duration-200 ${activeRange === range
                                ? "bg-primary text-white hover:bg-primary/90"
                                : "text-black dark:text-white hover:bg-meta-4/50"
                                }`}
                            onClick={() => handleRangeChange(range as "Week" | "Month" | "Year")}
                        >
                            {range}
                        </Button>
                    ))}
                </div>
            </CardHeader>

            <CardContent>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                            className="text-black dark:text-white"
                        >
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'currentColor', fontSize: 12 }}
                                dy={10}
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
                                cursor={{ fill: 'var(--chart-hover)' }}
                            />
                            <Bar
                                dataKey="value"
                                barSize={40}
                                shape={CustomBar}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default StatisticChart;