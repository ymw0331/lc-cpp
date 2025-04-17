"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import USDTIcon from "@/components/Icons/dashboard/USDTIcon";
import { useTranslation } from "react-i18next";

interface IncentiveCardProps {
    title: string;
    amount: number;
    icon?: React.ReactNode;
    badge?: {
        text: string;
        type: "claimed" | "fulfilled";
    };
    activeUsers?: number;
    className?: string;
}

const IncentiveCard = ({
    title,
    amount,
    icon,
    badge,
    activeUsers,
    className = "",
}: IncentiveCardProps) => {
    const { t } = useTranslation();
    const isPrimary = className.includes("bg-primary");

    return (
        <Card
            className={`bg-white dark:bg-boxdark border-stroke dark:border-strokedark ${className} 
            transition-all duration-200 hover:shadow-lg`}
        >
            <CardHeader className="flex flex-col space-y-2 xs:space-y-0 xs:flex-row xs:items-center xs:justify-between pb-2 px-3 sm:px-4">
                <div className="flex items-center justify-between w-full gap-2">
                    <CardTitle
                        className={`text-sm xs:text-base sm:text-lg font-medium break-words 
                        ${isPrimary ? "text-white" : "text-body dark:text-bodydark"}`}
                    >
                        {title}
                    </CardTitle>
                    {badge?.type === "fulfilled" && (
                        <Badge
                            variant="secondary"
                            className="bg-meta-8 text-black dark:text-white whitespace-nowrap text-xs sm:text-sm"
                        >
                            {badge.text}
                        </Badge>
                    )}
                    {icon && <div className="ml-auto shrink-0">{icon}</div>}
                </div>
            </CardHeader>

            <CardContent className="px-3 sm:px-4">
                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span
                            className={`text-xl xs:text-2xl sm:text-3xl font-bold break-all
                            ${isPrimary ? "text-white" : "text-black dark:text-white"}`}
                        >
                            $ {amount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                        <USDTIcon className={`w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 ${isPrimary ? "text-white" : ""}`} />
                    </div>
                    {badge?.type === "claimed" && (
                        <button
                            className="w-full xs:w-auto px-3 py-1.5 rounded-lg bg-meta-9 dark:bg-meta-4 
                            text-black dark:text-white text-xs sm:text-sm font-medium 
                            hover:bg-opacity-90 transition-all duration-200"
                        >
                            {badge.text}
                        </button>
                    )}
                </div>
                {typeof activeUsers === "number" && (
                    <div className="mt-3 xs:mt-4">
                        <p className="text-sm xs:text-base sm:text-lg font-medium text-black dark:text-white">
                            {activeUsers} {t("incentiveCard.activeUsersLeft")}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default IncentiveCard;
