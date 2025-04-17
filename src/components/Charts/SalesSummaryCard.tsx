"use client";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
}

const SalesSummaryCard = ({
    groupSales = 0,
    personalSales = 0,
    className,
}: SalesSummaryProps) => {
    const { t } = useTranslation();

    const totalSales = groupSales + personalSales;
    const groupSalesPercentage = totalSales > 0 ? (groupSales / totalSales) * 100 : 0;
    const personalSalesPercentage = totalSales > 0 ? (personalSales / totalSales) * 100 : 0;

    const data = [
        { name: t("salesSummaryCard.groupSales"), value: groupSalesPercentage },
        { name: t("salesSummaryCard.personalSales"), value: personalSalesPercentage },
    ];

    const COLORS = ["#D61768", "#FFB5D6"];

    const CustomLegend = ({ payload }: any) => {
        return (
            <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-4 sm:gap-8 mt-4 sm:mt-8">
                {payload.map((entry: any, index: number) => (
                    <div key={`legend-${index}`} className="flex items-center justify-center sm:justify-start gap-2">
                        <div
                            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="text-sm sm:text-base font-medium text-black dark:text-bodydark">
                            {entry.payload.name}: {entry.payload.value.toFixed(1)}%
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
                className="text-sm sm:text-base lg:text-lg font-semibold"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
                {`${value.toFixed(1)}%`}
            </text>
        );
    };

    return (
        <Card className={cn(
            "border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-full",
            className
        )}>
            <CardHeader className="pb-2">
                <CardTitle className="text-xl sm:text-2xl font-normal text-gray-500 dark:text-bodydark">
                    {t("salesSummaryCard.salesSummary")}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] sm:h-[250px] lg:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={CustomLabel}
                                outerRadius="90%"
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
            </CardContent>
        </Card>
    );
};

export default SalesSummaryCard;