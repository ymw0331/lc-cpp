"use client";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend
} from "recharts";

interface SalesSummaryProps {
    groupSales?: number;
    personalSales?: number;
    className?: string;
    comingSoon?: boolean;
}

const SalesSummaryCard = ({
    groupSales = 73.2,
    personalSales = 27.8,
    className,
    comingSoon = false,
}: SalesSummaryProps) => {
    const { t } = useTranslation();

    // If comingSoon is true, render coming soon state
    if (comingSoon) {
        return (
            <div
                className={cn(
                    "rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark h-full",
                    className
                )}
            >
                <div className="mb-8">
                    <h4 className="text-2xl font-normal text-gray-500 dark:text-bodydark">
                        {t("salesSummaryCard.salesSummary")}
                    </h4>
                </div>

                <div className="flex items-center justify-center h-[300px] w-full">
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        {t('common.comingSoon')}
                    </p>
                </div>
            </div>
        );
    }

    const data = [
        { name: t("salesSummaryCard.groupSales"), value: groupSales },
        { name: t("salesSummaryCard.personalSales"), value: personalSales },
    ];

    // Exact colors from the screenshot
    const COLORS = ["#D61768", "#FFB5D6"];

    const CustomLegend = ({ payload }: any) => {
        return (
            <div className="flex gap-8 mt-8">
                {payload.map((entry: any, index: number) => (
                    <div key={`legend-${index}`} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="text-base font-medium text-black dark:text-bodydark">
                            {entry.name}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    const CustomLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        value,
    }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="#000000"
                className="text-lg font-semibold"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
                {`${value}%`}
            </text>
        );
    };

    return (
        <div
            className={cn(
                "rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark h-full",
                className
            )}
        >
            <div className="mb-8">
                <h4 className="text-2xl font-normal text-gray-500 dark:text-bodydark">
                    {t("salesSummaryCard.salesSummary")}
                </h4>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={CustomLabel}
                            outerRadius={120}
                            innerRadius={0}
                            startAngle={90}
                            endAngle={-270}
                            paddingAngle={0}
                            dataKey="value"
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} stroke="none" />
                            ))}
                        </Pie>
                        <Legend content={CustomLegend} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SalesSummaryCard;