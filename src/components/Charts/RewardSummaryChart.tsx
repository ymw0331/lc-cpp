"use client";

import { useEffect, useState } from "react";
import AnalyticChart from "@/components/Charts/AnalyticChart";
import { walletApi } from "@/api/wallet/wallet.api";
import { RewardChartParams } from "@/api/wallet/wallet.types";
import { ChartDataPoint } from "@/api/dashboard/dashboard.types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface RewardSummaryChartProps {
    title: string;
    className?: string;
    lineColor?: string;
}

const RewardSummaryChart = ({
    title,
    className,
    lineColor = "var(--chart-primary)"
}: RewardSummaryChartProps) => {
    const { t } = useTranslation();
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalReward, setTotalReward] = useState<number>(0);
    const [chartData, setChartData] = useState<{
        Month: ChartDataPoint[];
        Year: ChartDataPoint[];
    }>({
        Month: [],
        Year: []
    });

    const fetchRewardChartData = async () => {
        setLoading(true);
        try {
            const params: RewardChartParams = { year, month };
            const response = await walletApi.getRewardChartData(params);
            setTotalReward(response.totalDrReward);
            const formattedData = walletApi.formatRewardChartData(response);
            setChartData({
                Month: formattedData.Month,
                Year: formattedData.Year
            });
        } catch (error) {
            console.error("Failed to fetch reward chart data:", error);
            // Initialize with zero data on error
            setTotalReward(0);
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
        fetchRewardChartData();
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
                    <p className="text-sm font-medium text-primary mt-1">
                        {t('rewardSummaryChart.totalReward')}: ${totalReward.toLocaleString()}
                    </p>
                </div>
                <div className="flex flex-row gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {t('rewardSummaryChart.year')}:
                        </span>
                        <Select
                            value={year.toString()}
                            onValueChange={(value) => setYear(Number(value))}
                        >
                            <SelectTrigger className="w-[100px]">
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
                            {t('rewardSummaryChart.month')}:
                        </span>
                        <Select
                            value={month.toString()}
                            onValueChange={(value) => setMonth(Number(value))}
                        >
                            <SelectTrigger className="w-[100px]">
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

            <AnalyticChart
                title=""
                chartData={{
                    Month: chartData.Month,
                    Year: chartData.Year,
                    // Empty array for Week since it's not used
                    Week: []
                }}
                lineColor={lineColor}
                className={cn("overflow-x-auto w-full", className)}
            />
        </div>
    );
};

export default RewardSummaryChart; 