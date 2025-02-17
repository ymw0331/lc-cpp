"use client";

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
        <div
            className={cn(
                "rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark",
                className
            )}
        >
            <div className="mb-4">
                <h4 className="text-title-sm font-normal text-bodydark2 dark:text-bodydark">
                    {title}
                </h4>
            </div>

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
        </div>
    );
};

export default ProgressCard;
