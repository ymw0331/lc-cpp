"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { dashboardApi } from "@/api/dashboard/dashboard.api";
import { ChartRangeData, DepositChartParams, CurrencyType } from "@/api/dashboard/dashboard.types";
import StatisticChart from "@/components/Charts/StatisticChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DepositOverviewChartProps {
    className?: string;
    lineColor?: string;
}

const DepositOverviewChart: React.FC<DepositOverviewChartProps> = ({
    className,
    lineColor = "#7C74FF"
}) => {
    const { t } = useTranslation();
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalDeposit, setTotalDeposit] = useState<number>(0);
    const [depositChartData, setDepositChartData] = useState<ChartRangeData>({
        Week: [],
        Month: [],
        Year: []
    });
    const [currency, setCurrency] = useState<CurrencyType>("USDT");

    useEffect(() => {
        const fetchDepositChartData = async () => {
            setLoading(true);
            try {
                const params: DepositChartParams = { year, month };
                const response = await dashboardApi.getDepositChartData(params);
                setTotalDeposit(response.totalDeposit);
                const formattedData = dashboardApi.formatDepositChartData(response);
                setDepositChartData(formattedData);
                setCurrency("USDT"); // Default to USDT as the API returns amounts in USDT
            } catch (error) {
                console.error("Failed to fetch deposit chart data:", error);
                // Initialize with empty data on error
                setTotalDeposit(0);
                setDepositChartData({
                    Week: [],
                    Month: [],
                    Year: []
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDepositChartData();
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
                        {t('agentDashboard.referralDepositVolume')}
                    </h3>
                    <p className="text-sm font-medium text-primary mt-1">
                        {t('depositOverviewChart.totalDeposit')}: $ {totalDeposit.toLocaleString()}
                    </p>
                </div>
                <div className="flex flex-row gap-4">
                    <div className="flex items-center gp-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {t('rewardSummaryChart.year')}:
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
                            {t('rewardSummaryChart.month')}:
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

            <div className="w-full overflow-hidden rounded-lg">
                <StatisticChart
                    title=""
                    total={totalDeposit}
                    currency={currency}
                    chartData={depositChartData}
                    showLegend={false}
                    lineColor={lineColor}
                />
            </div>
        </div>
    );
};

export default DepositOverviewChart; 