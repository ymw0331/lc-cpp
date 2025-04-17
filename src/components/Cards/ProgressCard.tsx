"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface ProgressCardProps {
    title: string;
    currentValue: number;
    targetValue: number;
    suffix?: string;
    progressColor?: string;
    className?: string;
}

const ProgressCard = ({
    title,
    currentValue,
    targetValue,
    suffix = "",
    className,
}: ProgressCardProps) => {
    const { t } = useTranslation();
    const percentage = (currentValue / targetValue) * 100;

    return (
        <Card className={cn(
            "border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark",
            className
        )}>
            <CardHeader className="pb-2">
                <CardTitle className="text-title-sm font-normal text-bodydark2 dark:text-bodydark">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2">
                    <div className="flex items-end justify-between">
                        <h4 className="text-title-md2 font-bold text-black dark:text-white">
                            {currentValue.toLocaleString()}
                            <span className="text-sm font-normal text-bodydark2 dark:text-bodydark ml-1">
                                / {targetValue.toLocaleString()} {suffix}
                            </span>
                        </h4>
                        <span className="text-title-sm font-medium text-black dark:text-white">
                            {percentage.toFixed(1)}%
                        </span>
                    </div>

                    <div className="relative h-3 w-full rounded-full bg-stroke dark:bg-strokedark">
                        <div
                            className="h-full rounded-full bg-primary transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProgressCard;
