"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { useState } from "react";
import { ChartDataPoint, ChartRangeData, CurrencyType } from "@/types/dashboard";
// import { depositChartData } from "@/lib/data";

type TimeRange = "Week" | "Month" | "Year";

interface StatisticChartProps {
    title: string;
    total: number;
    currency: CurrencyType;
    chartData: ChartDataPoint[]; // Changed to match your DashboardStatistics type

}


const StatisticChart: React.FC<StatisticChartProps> = ({
    title,
    total,
    currency,
    chartData
}) => {

    const [activeRange, setActiveRange] = useState<"Week" | "Month" | "Year">("Year");
    const [depositChartData, setDepositChartData] = useState<ChartDataPoint[]>(chartData);


    const handleRangeChange = (range: TimeRange) => {
        setActiveRange(range);
    };

    const formatValue = (value: number) => {
        return `${value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })} ${currency}`;
    };

    const formatLabelValue = (value: number) => {
        return value.toLocaleString('en-US');
    };

    const CustomBarLabel = (props: any) => {
        const { x, y, width, value } = props;
        return (
            <text
                x={x + width / 2}
                y={y - 10}
                fill="#64748B"
                textAnchor="middle"
                fontSize={12}
                fontWeight="500"
            >
                {formatLabelValue(value)}
            </text>
        );
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload?.[0]) {
            return (
                <div className="bg-white dark:bg-boxdark border border-stroke dark:border-strokedark shadow-lg p-3">
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
                fill={index % 2 === 0 ? "#7C74FF" : "#E9E7FD"}
                rx={0}
                ry={0}
            />
        );
    };


    const hasData = chartData && chartData.length > 0;


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

                <div className="flex space-x-2 bg-gray-100 dark:bg-meta-4 p-1">
                    {["Week", "Month", "Year"].map((range) => (
                        <Button
                            key={range}
                            variant={activeRange === range ? "default" : "ghost"}
                            className={`rounded-full px-6 transition-all duration-200 ${activeRange === range
                                ? "bg-primary text-white hover:bg-primary/90"
                                : "text-black dark:text-white hover:bg-meta-4/50"
                                }`}
                            onClick={() =>
                                handleRangeChange(range as "Week" | "Month" | "Year")
                            }
                        >
                            {range}
                        </Button>
                    ))}
                </div>
            </CardHeader>

            <CardContent>
                <div className="h-[400px] w-full flex items-center justify-center">
                    {hasData ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart
                                data={depositChartData}
                                margin={{ top: 40, right: 10, left: 0, bottom: 0 }}
                                className="text-black dark:text-white"
                            >
                                <XAxis
                                    dataKey="label"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                    width={80}
                                    tickFormatter={(value) => value.toLocaleString()}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                                />
                                <Bar
                                    dataKey="value"
                                    barSize={40}
                                    shape={CustomBar}
                                >
                                    <LabelList
                                        dataKey="value"
                                        position="top"
                                        content={CustomBarLabel}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            No Data Available
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default StatisticChart;