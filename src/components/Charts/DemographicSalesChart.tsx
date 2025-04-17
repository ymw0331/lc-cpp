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

interface DemographicData {
    [location: string]: {
        [period: string]: number;
    };
}

interface DemographicSalesChartProps {
    comingSoon?: boolean;
    demographicData: DemographicData;
}

const DemographicSalesChart = ({
    comingSoon = false,
    demographicData
}: DemographicSalesChartProps) => {
    const { t } = useTranslation();
    const [selectedYear, setSelectedYear] = useState("2024");
    const [selectedQuarter, setSelectedQuarter] = useState("Q1");

    // Format data based on selected filters
    const getData = () => {
        const period = `${selectedQuarter}_${selectedYear}`;
        return Object.entries(demographicData).map(([location, values]) => ({
            name: location,
            value: values[period as keyof typeof values],
        }));
    };

    // If comingSoon is true, render coming soon state
    if (comingSoon) {
        return (
            <Card className="border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 px-0">
                    <div className="space-y-4">
                        <CardTitle className="text-2xl font-semibold text-black dark:text-white">
                            {t("demographicSalesChart.salesVolumeInDemographic")}
                        </CardTitle>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Year Filter */}
                        <Select value={selectedYear} onValueChange={setSelectedYear} disabled>
                            <SelectTrigger className="w-[100px] bg-transparent border-stroke">
                                <SelectValue placeholder={t("demographicSalesChart.year")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2023">2023</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Quarter Filter */}
                        <Select value={selectedQuarter} onValueChange={setSelectedQuarter} disabled>
                            <SelectTrigger className="w-[120px] bg-transparent border-stroke">
                                <SelectValue placeholder={t("demographicSalesChart.quarter")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Q1">Q1</SelectItem>
                                <SelectItem value="Q2">Q2</SelectItem>
                                <SelectItem value="Q3">Q3</SelectItem>
                                <SelectItem value="Q4">Q4</SelectItem>
                            </SelectContent>
                        </Select>
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

    const CustomBarLabel = ({ x, y, width, value }: any) => {
        return (
            <text
                x={x + width / 2}
                y={y - 10}
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
        <Card className="border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 px-0">
                <div className="space-y-4">
                    <CardTitle className="text-2xl font-semibold text-black dark:text-white">
                        {t("demographicSalesChart.salesVolumeInDemographic")}
                    </CardTitle>
                    <div className="text-4xl font-bold text-black dark:text-white">
                        {getData()
                            .reduce((sum, item) => sum + item.value, 0)
                            .toLocaleString()}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Year Filter */}
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[100px] bg-transparent border-stroke">
                            <SelectValue placeholder={t("demographicSalesChart.year")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Quarter Filter */}
                    <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                        <SelectTrigger className="w-[120px] bg-transparent border-stroke">
                            <SelectValue placeholder={t("demographicSalesChart.quarter")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Q1">Q1</SelectItem>
                            <SelectItem value="Q2">Q2</SelectItem>
                            <SelectItem value="Q3">Q3</SelectItem>
                            <SelectItem value="Q4">Q4</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <CardContent className="px-0">
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={getData()}
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
                                tickFormatter={(value) => value.toLocaleString()}
                                tickMargin={12}
                                stroke="#64748B"
                                domain={[0, 120000]}
                            />
                            <Tooltip
                                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                }}
                                formatter={(value: number) => [value.toLocaleString(), "Sales"]}
                            />
                            <Bar dataKey="value" fill="#94A3B8" radius={[0, 0, 0, 0]} label={CustomBarLabel} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default DemographicSalesChart;