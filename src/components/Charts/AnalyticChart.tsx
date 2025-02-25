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
import { ChartDataPoint } from "@/types/dashboard";
import { useTranslation } from "react-i18next";

type Period = "Week" | "Month" | "Year";

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
    comingSoon?: boolean;
}

const AnalyticChart = ({
    title,
    chartData,
    legendLabel,
    showLegend = false,
    legendPosition = "top-right",
    lineColor = "#F69732",
    className,
    comingSoon = false
}: AnalyticChartProps) => {
    const { t } = useTranslation();
    const [activePeriod, setActivePeriod] = useState<Period>("Year");

    // If comingSoon is true, render coming soon state
    if (comingSoon) {
        return (
            <Card
                className={cn(
                    "p-6 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark flex items-center justify-center",
                    className
                )}
            >
                <div className="text-center">
                    <h4 className="text-2xl font-bold text-black dark:text-white mb-4">
                        {title}
                    </h4>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        {t('analyticChart.comingSoon')}
                    </p>
                </div>
            </Card>
        );
    }

    const activeData = chartData[activePeriod];
    const hasData = activeData && activeData.length > 0;

    const allValues = hasData ? activeData.map((d) => d.value) : [0];
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
                "bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark",
                className
            )}
        >
            <CardHeader className="p-6 pb-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="text-2xl font-bold text-black dark:text-white mb-4">
                            {title}
                        </h4>
                    </div>

                    <div className="flex gap-2">
                        {(["Week", "Month", "Year"] as Period[]).map((period) => (
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

                {showLegend && legendPosition === "top-right" && <CustomLegend />}
            </CardHeader>

            <CardContent className="p-6 pt-0">
                <div className="h-[250px] sm:h-[300px] w-full mt-4 -mx-4 sm:mx-0">
                    {hasData ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData[activePeriod]}
                                margin={{
                                    top: 30,
                                    right: 10,
                                    left: 10,
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
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: "#64748B",
                                        fontSize: window.innerWidth < 640 ? 10 : 12,
                                    }}
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
                                        stroke: "#fff",
                                        strokeWidth: 2,
                                    }}
                                    activeDot={{
                                        r: 6,
                                        fill: lineColor,
                                        stroke: "#fff",
                                        strokeWidth: 2,
                                    }}
                                    label={<CustomLabel />}
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