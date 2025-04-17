"use client";

import { Button } from "@/components/ui/button";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LabelList,
} from "recharts";
import { useState, useEffect } from "react";
import { ChartDataPoint, CurrencyType } from "@/api/dashboard/dashboard.types";
import { useTranslation } from "react-i18next";

type TimeRange = "Month" | "Year";

interface StatisticChartProps {
    title: string;
    total?: number; // Make total optional as we'll calculate it from chartData
    currency: CurrencyType;
    chartData: {
        Week?: ChartDataPoint[];
        Month?: ChartDataPoint[];
        Year?: ChartDataPoint[];
    } | ChartDataPoint[]; // Support both formats for backward compatibility
    showLegend?: boolean;
    legendLabel?: string;
    legendPosition?: "top-left" | "top-right";
    lineColor?: string;
}

const StatisticChart: React.FC<StatisticChartProps> = ({
    title,
    total,
    currency,
    chartData,
    showLegend = false,
    legendLabel = "",
    legendPosition = "top-right",
    lineColor = "#7C74FF"
}) => {
    const [activeRange, setActiveRange] = useState<TimeRange>("Year");
    const [currentChartData, setCurrentChartData] = useState<ChartDataPoint[]>([]);
    const [calculatedTotal, setCalculatedTotal] = useState<number>(total || 0);
    const { t } = useTranslation();

    // Process chartData based on its type and the active range
    useEffect(() => {
        let newData: ChartDataPoint[] = [];

        // Check if chartData is an array or an object with range keys
        if (Array.isArray(chartData)) {
            // It's a simple array, use it directly
            newData = chartData;
        } else {
            // It's an object with range keys
            newData = chartData[activeRange] || [];
        }

        setCurrentChartData(newData);

        // Calculate total from the current range data
        const newTotal = newData.reduce((sum, item) => sum + item.value, 0);
        setCalculatedTotal(total !== undefined ? total : newTotal);
    }, [chartData, activeRange, total]);

    const handleRangeChange = (range: TimeRange) => {
        setActiveRange(range);
    };

    const formatValue = (value: number) => {
        return `${value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })} ${currency}`;
    };

    const formatLabelValue = (value: number) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(2)}M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(2)}K`;
        }
        return value.toFixed(2);
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
                transform={`rotate(-45 ${x + width / 2} ${y - 10})`}
            >
                ${formatLabelValue(value)}
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
        const alternateColor = lineColor === "#7C74FF" ? "#E9E7FD" : `${lineColor}50`;
        return (
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={index % 2 === 0 ? lineColor : alternateColor}
                rx={0}
                ry={0}
            />
        );
    };

    const hasData = currentChartData && currentChartData.length > 0;

    return (
        <div className="w-full bg-white dark:bg-boxdark overflow-hidden">
            <div className="p-4 sm:p-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-4 sm:pb-6 border-b border-stroke dark:border-strokedark">
                <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-black dark:text-white">
                        {title}
                    </h3>
                    <p className="text-2xl sm:text-4xl font-bold mt-2 text-black dark:text-white">
                        $ {formatValue(calculatedTotal)}
                    </p>
                </div>

                <div className="flex space-x-2 bg-gray-100 dark:bg-meta-4 p-1 rounded-full self-start sm:self-center">
                    {["Month", "Year"].map((range) => (
                        <Button
                            key={range}
                            variant={activeRange === range ? "default" : "ghost"}
                            className={`rounded-full px-4 sm:px-6 py-1.5 sm:py-2 text-sm transition-all duration-200 ${
                                activeRange === range
                                    ? "bg-primary text-white hover:bg-primary/90"
                                    : "text-black dark:text-white hover:bg-meta-4/50"
                            }`}
                            onClick={() => handleRangeChange(range as TimeRange)}
                        >
                            {range}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="p-4 sm:p-6">
                <div className="h-[300px] sm:h-[400px] w-full flex items-center justify-center relative">
                    {hasData ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={currentChartData}
                                margin={{ 
                                    top: 40, 
                                    right: window.innerWidth < 640 ? 5 : 10, 
                                    left: 0, 
                                    bottom: window.innerWidth < 640 ? 20 : 0 
                                }}
                                className="text-black dark:text-white"
                            >
                                {showLegend && legendLabel && (
                                    <text
                                        x={legendPosition === "top-right" ? "90%" : "10%"}
                                        y={20}
                                        textAnchor={legendPosition === "top-right" ? "end" : "start"}
                                        fill="#64748B"
                                        fontSize={12}
                                    >
                                        {legendLabel}
                                    </text>
                                )}
                                <XAxis
                                    dataKey="label"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ 
                                        fill: "#64748B", 
                                        fontSize: window.innerWidth < 640 ? 10 : 12 
                                    }}
                                    dy={10}
                                    interval={window.innerWidth < 640 ? 1 : 0}
                                    angle={window.innerWidth < 640 ? -45 : 0}
                                    textAnchor={window.innerWidth < 640 ? "end" : "middle"}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ 
                                        fill: "#64748B", 
                                        fontSize: window.innerWidth < 640 ? 10 : 12 
                                    }}
                                    width={window.innerWidth < 640 ? 40 : 80}
                                    tickFormatter={(value) => value.toLocaleString()}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                                />
                                <Bar 
                                    dataKey="value" 
                                    barSize={window.innerWidth < 640 ? 20 : 40} 
                                    shape={CustomBar}
                                >
                                    <LabelList 
                                        dataKey="value" 
                                        position="top" 
                                        content={CustomBarLabel}
                                        offset={30}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            {t("statisticChart.noDataAvailable")}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatisticChart;