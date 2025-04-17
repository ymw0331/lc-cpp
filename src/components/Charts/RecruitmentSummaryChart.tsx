"use client";

import { useEffect, useState } from "react";
import AnalyticChart from "./AnalyticChart";
import { recruitApi } from "@/api/referral/referral.api";
import { DownstreamChartParams } from "@/api/referral/referral.types";
import { ChartDataPoint } from "@/api/dashboard/dashboard.types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface RecruitmentSummaryChartProps {
    title: string;
    className?: string;
    lineColor?: string;
}

const RecruitmentSummaryChart = ({
    title,
    className,
    lineColor = "#F69732"
}: RecruitmentSummaryChartProps) => {
    const { t } = useTranslation();
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalDownstream, setTotalDownstream] = useState<number>(0);
    const [chartData, setChartData] = useState<{
        Month: ChartDataPoint[];
        Year: ChartDataPoint[];
    }>({
        Month: [],
        Year: []
    });

    const fetchDownstreamChartData = async () => {
        setLoading(true);
        try {
            const params: DownstreamChartParams = { year, month };
            const response = await recruitApi.getDownstreamChartData(params);
            setTotalDownstream(response.totalDownstream);
            const formattedData = recruitApi.formatDownstreamChartData(response);
            setChartData({
                Month: formattedData.Month,
                Year: formattedData.Year
            });
        } catch (error) {
            console.error("Failed to fetch downstream chart data:", error);
            // Initialize with zero data on error
            setTotalDownstream(0);
            setChartData({
                Month: Array.from({ length: 31 }, (_, i) => ({
                    label: (i + 1).toString(),
                    value: 0
                })),
                Year: Array.from({ length: 12 }, (_, i) => ({
                    label: (i + 1).toString(),
                    value: 0
                }))
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDownstreamChartData();
    }, [year, month]);

    // Generate years list (current year and 2 previous years)
    const currentYear = new Date().getFullYear();
    const yearOptions = [currentYear, currentYear - 1, currentYear - 2];

    // Generate months list
    const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <div className="flex flex-col">
                    <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white">
                        {title}
                    </h3>
                    <p className="text-sm font-medium text-secondary mt-1">
                        {t('recruitmentSummaryChart.totalDownstream')}: {totalDownstream.toLocaleString()}
                    </p>
                </div>
                <div className="flex flex-row gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {t('recruitmentSummaryChart.year')}:
                        </span>
                        <Select
                            value={year.toString()}
                            onValueChange={(value) => setYear(Number(value))}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder={year.toString()} />
                            </SelectTrigger>
                            <SelectContent>
                                {yearOptions.map((y) => (
                                    <SelectItem key={y} value={y.toString()}>
                                        {y}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {t('recruitmentSummaryChart.month')}:
                        </span>
                        <Select
                            value={month.toString()}
                            onValueChange={(value) => setMonth(Number(value))}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder={month.toString()} />
                            </SelectTrigger>
                            <SelectContent>
                                {monthOptions.map((m) => (
                                    <SelectItem key={m} value={m.toString()}>
                                        {t(`months.${m === 1 ? 'january' : 
                                            m === 2 ? 'february' : 
                                            m === 3 ? 'march' : 
                                            m === 4 ? 'april' : 
                                            m === 5 ? 'may' : 
                                            m === 6 ? 'june' : 
                                            m === 7 ? 'july' : 
                                            m === 8 ? 'august' : 
                                            m === 9 ? 'september' : 
                                            m === 10 ? 'october' : 
                                            m === 11 ? 'november' : 'december'}`)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="w-full overflow-hidden">
                <AnalyticChart
                    title=""
                    chartData={{
                        Month: chartData.Month,
                        Year: chartData.Year,
                        Week: []
                    }}
                    lineColor={lineColor}
                    className={cn("w-full min-w-0", className)}
                />
            </div>
        </div>
    );
};

export default RecruitmentSummaryChart; 