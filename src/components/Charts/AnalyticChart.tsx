"use client";

import { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChartDataPoint } from "@/api/dashboard/dashboard.types";
import { useTranslation } from "react-i18next";

type Period = "Month" | "Year";

interface AnalyticChartProps {
    title: string;
    chartData: {
        Week: ChartDataPoint[];
        Month: ChartDataPoint[];
        Year: ChartDataPoint[];
    };
    legendLabel?: string;
    showLegend?: boolean;
    legendPosition?: "top-right" | "bottom-right";
    lineColor?: string;
    className?: string;
}

const AnalyticChart = ({
    title,
    chartData,
    legendLabel,
    showLegend = false,
    legendPosition = "top-right",
    lineColor = "var(--chart-primary)",
    className,
}: AnalyticChartProps) => {
    const { t } = useTranslation();
    const [activePeriod, setActivePeriod] = useState<Period>("Year");

    const activeData = chartData[activePeriod];
    const hasData = activeData && activeData.length > 0;

    // Initialize default values to prevent empty charts
    let allValues = [0];
    if (hasData) {
        allValues = activeData.map((d) => d.value);
        if (allValues.length === 0 || Math.max(...allValues) === 0) {
            allValues = [0];
        }
    }

    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);

    // Calculate a dynamic step size based on the max value
    const calculateStepSize = (max: number) => {
        if (max <= 10) return 2;
        if (max <= 50) return 10;
        if (max <= 100) return 20;
        if (max <= 500) return 100;
        if (max <= 1000) return 200;
        return Math.ceil(max / 5 / 100) * 100;
    };

    const stepSize = calculateStepSize(maxValue);
    // Add 20% buffer to the max value for better visualization
    const yAxisMax = Math.min(
        Math.ceil((maxValue * 1.2) / stepSize) * stepSize,
        Math.ceil(maxValue / stepSize) * stepSize + stepSize
    );
    const yAxisMin = Math.max(0, Math.floor(minValue / stepSize) * stepSize);

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
            <div
                className={cn(
                    "flex items-center",
                    legendPosition === "top-right" ? "justify-end mb-4" : "justify-end mt-2"
                )}
            >
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

    const CustomLabel = (props: any) => {
        const { x, y, value } = props;
        return (
            <text
                x={x}
                y={y - 15} // Position above the dot
                fill="#64748B"
                textAnchor="middle"
                fontSize={12}
                fontWeight="500"
            >
                {value.toLocaleString()}
            </text>
        );
    };

    return (
        <Card
            className={cn(
                "bg-white dark:bg-boxdark border border-stroke dark:border-strokedark w-full",
                className
            )}
        >
            <CardHeader className="p-4 sm:p-6 pb-0">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                        <h4 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4">
                            {title}
                        </h4>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                        {(["Month", "Year"] as Period[]).map((period) => (
                            <Button
                                key={period}
                                variant={activePeriod === period ? "default" : "outline"}
                                className={cn(
                                    "px-3 sm:px-4 py-2 rounded-full text-sm",
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

                {showLegend && legendPosition === "top-right" && <CustomLegend />}
            </CardHeader>

            <CardContent className="p-4 sm:p-6 pt-0">
                <div className="h-[250px] sm:h-[300px] w-full mt-4">
                    {hasData ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData[activePeriod]}
                                margin={{
                                    top: 30,
                                    right: 5,
                                    left: 0,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="5 5"
                                    vertical={false}
                                    stroke="rgba(226, 232, 240, 0.5)"
                                />
                                <XAxis
                                    dataKey="label"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: "#64748B",
                                        fontSize: window.innerWidth < 640 ? 10 : 12,
                                    }}
                                    dy={10}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: "#64748B",
                                        fontSize: window.innerWidth < 640 ? 10 : 12,
                                    }}
                                    domain={[yAxisMin, yAxisMax]}
                                    width={35}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={lineColor}
                                    strokeWidth={2}
                                    dot={{
                                        r: 3,
                                        fill: lineColor,
                                        stroke: "#fff",
                                        strokeWidth: 2,
                                    }}
                                    activeDot={{
                                        r: 5,
                                        fill: lineColor,
                                        stroke: "#fff",
                                        strokeWidth: 2,
                                    }}
                                    label={window.innerWidth >= 640 ? <CustomLabel /> : undefined}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-lg text-gray-500 dark:text-gray-400">
                                {t('analyticChart.noDataAvailable')}
                            </p>
                        </div>
                    )}
                </div>

                {showLegend && legendPosition === "bottom-right" && <CustomLegend />}
            </CardContent>
        </Card>
    );
};

export default AnalyticChart;