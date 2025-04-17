"use client";
import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ResponsiveContainer,
    BarChart,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Bar
} from "recharts";
import { useTranslation } from "react-i18next";

interface MonthlyData {
    name: string;
    value: number;
}

interface WeeklyData {
    name: string;
    value: number;
}

interface SalesVolumeData {
    monthlyData2024: MonthlyData[];
    monthlyData2023: MonthlyData[];
    weeklyData: {
        [key: string]: WeeklyData[];
    };
}

const SalesVolumeBarChart = ({
    salesVolumeData,
    comingSoon = false,
}: {
    salesVolumeData: SalesVolumeData;
    comingSoon?: boolean;
}) => {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState<"week" | "month" | "year">("year");
    const [selectedYear, setSelectedYear] = useState("2024");
    const [selectedMonth, setSelectedMonth] = useState("Jan");
    const [selectedWeek, setSelectedWeek] = useState("Week 1");

    // Get data based on filters
    const getData = () => {
        if (comingSoon) return []; // Return empty array when coming soon

        if (viewMode === "year") {
            return selectedYear === "2024"
                ? salesVolumeData.monthlyData2024
                : salesVolumeData.monthlyData2023;
        } else if (viewMode === "month") {
            return selectedMonth === "Jan"
                ? salesVolumeData.monthlyData2024
                : salesVolumeData.monthlyData2024; // Adjust as needed
        } else {
            // viewMode === 'week'
            // Ensure we are accessing the correct weekly data
            const weekData = salesVolumeData.weeklyData[selectedMonth];
            return weekData || []; // Return an empty array if weekData is undefined
        }
    };

    // Calculate total
    const data = getData();
    const total = data.length > 0
        ? data.reduce((sum, item) => sum + item.value, 0)
        : 0;

    // Check if there's no data
    const hasNoData = data.length === 0;

    interface CustomBarLabelProps {
        x: number;
        y: number;
        width: number;
        value: number;
    }
    const CustomBarLabel = ({ x, y, width, value }: CustomBarLabelProps) => {
        return (
            <text
                x={x + width / 2}
                y={y - 10}
                fill="#64748B"
                textAnchor="middle"
                fontSize={12}
            >
                ${value}
            </text>
        );
    };

    if (comingSoon) {
        return (
            <Card className="border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 px-0">
                    <div className="space-y-4">
                        <CardTitle className="text-2xl font-semibold text-black dark:text-white">
                            {t("salesVolumeBarChart.salesVolume")}
                        </CardTitle>
                    </div>
                </CardHeader>

                <CardContent className="flex items-center justify-center h-[400px]">
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        {t('common.comingSoon')}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 px-0">
                <div className="space-y-4">
                    <CardTitle className="text-2xl font-semibold text-black dark:text-white">
                        {t("salesVolumeBarChart.salesVolume")}
                    </CardTitle>
                    {!hasNoData && (
                        <div className="text-4xl font-bold text-black dark:text-white">
                            ${(total / 1000).toFixed(3)}K
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {/* Year Filter */}
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[100px] bg-transparent border-stroke">
                            <SelectValue placeholder={t("salesVolumeBarChart.year")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 rounded-md bg-whiter p-1 dark:bg-meta-4">
                        <button
                            onClick={() => setViewMode("week")}
                            className={`px-3 py-1 text-sm rounded-md ${
                                viewMode === "week"
                                    ? "bg-white text-black shadow-sm dark:bg-boxdark dark:text-white"
                                    : "text-gray-500 dark:text-gray-400"
                            }`}
                        >
                            {t("salesVolumeBarChart.week")}
                        </button>
                        <button
                            onClick={() => setViewMode("month")}
                            className={`px-3 py-1 text-sm rounded-md ${
                                viewMode === "month"
                                    ? "bg-white text-black shadow-sm dark:bg-boxdark dark:text-white"
                                    : "text-gray-500 dark:text-gray-400"
                            }`}
                        >
                            {t("salesVolumeBarChart.month")}
                        </button>
                        <button
                            onClick={() => setViewMode("year")}
                            className={`px-3 py-1 text-sm rounded-md ${
                                viewMode === "year"
                                    ? "bg-white text-black shadow-sm dark:bg-boxdark dark:text-white"
                                    : "text-gray-500 dark:text-gray-400"
                            }`}
                        >
                            {t("salesVolumeBarChart.year")}
                        </button>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {hasNoData ? (
                    <div className="flex items-center justify-center h-[300px]">
                        <p className="text-lg text-gray-500 dark:text-gray-400">
                            {t('common.noData')}
                        </p>
                    </div>
                ) : (
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar
                                    dataKey="value"
                                    fill="#D61768"
                                    radius={[4, 4, 0, 0]}
                                    label={CustomBarLabel}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default SalesVolumeBarChart;