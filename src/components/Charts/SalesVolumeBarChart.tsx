"use client";

import React, { useState } from "react";
import { Bar } from "recharts";
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
}: {
    salesVolumeData: SalesVolumeData;
}) => {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState<"week" | "month" | "year">("year");
    const [selectedYear, setSelectedYear] = useState("2024");
    const [selectedMonth, setSelectedMonth] = useState("Jan");
    const [selectedWeek, setSelectedWeek] = useState("Week 1");

    // Get data based on filters
    const getData = () => {
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
    const total = data.reduce((sum, item) => sum + item.value, 0);

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

    return (
        <Card className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 px-0">
                <div className="space-y-4">
                    <CardTitle className="text-2xl font-semibold text-black dark:text-white">
                        {t("salesVolumeBarChart.salesVolume")}
                    </CardTitle>
                    <div className="text-4xl font-bold text-black dark:text-white">
                        ${(total / 1000).toFixed(3)}K
                    </div>
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
                            className={`rounded-md px-3 py-1 text-sm ${viewMode === "week"
                                    ? "bg-primary text-white"
                                    : "bg-white text-black dark:bg-boxdark dark:text-white"
                                }`}
                        >
                            {t("salesVolumeBarChart.week")}
                        </button>
                        <button
                            onClick={() => setViewMode("month")}
                            className={`rounded-md px-3 py-1 text-sm ${viewMode === "month"
                                    ? "bg-primary text-white"
                                    : "bg-white text-black dark:bg-boxdark dark:text-white"
                                }`}
                        >
                            {t("salesVolumeBarChart.month")}
                        </button>
                        <button
                            onClick={() => setViewMode("year")}
                            className={`rounded-md px-3 py-1 text-sm ${viewMode === "year"
                                    ? "bg-primary text-white"
                                    : "bg-white text-black dark:bg-boxdark dark:text-white"
                                }`}
                        >
                            {t("salesVolumeBarChart.year")}
                        </button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-0">
                {/* Week Selector (only shown in week view) */}
                {viewMode === "week" && (
                    <div className="mb-6 flex items-center gap-4">
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-[180px] bg-transparent border-stroke">
                                <SelectValue placeholder={t("salesVolumeBarChart.selectMonth")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Jan2024">January 2024</SelectItem>
                                <SelectItem value="Feb2024">February 2024</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                            <SelectTrigger className="w-[140px] bg-transparent border-stroke">
                                <SelectValue placeholder={t("salesVolumeBarChart.selectWeek")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Week 1">Week 1</SelectItem>
                                <SelectItem value="Week 2">Week 2</SelectItem>
                                <SelectItem value="Week 3">Week 3</SelectItem>
                                <SelectItem value="Week 4">Week 4</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Month Selector (only shown in month view) */}
                {viewMode === "month" && (
                    <div className="mb-6">
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-[200px] bg-transparent border-stroke">
                                <SelectValue placeholder={t("salesVolumeBarChart.selectMonth")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Jan">January 2024</SelectItem>
                                <SelectItem value="Feb">February 2024</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data} // Use the data variable
                            margin={{ top: 40, right: 0, left: 0, bottom: 0 }}
                            barSize={40}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                fontSize={12}
                                tickMargin={12}
                                stroke="#64748B"
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                fontSize={12}
                                tickCount={7}
                                tickFormatter={(value) => `$${value}`}
                                tickMargin={12}
                                stroke="#64748B"
                                domain={[0, 6000]}
                            />
                            <Tooltip
                                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                }}
                                formatter={(value: number) => [`$${value}`, "Sales"]}
                            />
                            <Bar
                                dataKey="value"
                                fill="#94A3B8"
                                radius={[0, 0, 0, 0]}
                                label={CustomBarLabel}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default SalesVolumeBarChart;
