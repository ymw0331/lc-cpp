"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import USDTIcon from "../Icons/dashboard/USDTIcon";
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
            className={`bg-white dark:bg-boxdark border-stroke dark:border-strokedark ${className}`}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center justify-between w-full gap-2">
                    <CardTitle
                        className={`text-lg font-medium ${isPrimary ? "text-white" : "text-body dark:text-bodydark"
                            }`}
                    >
                        {title}
                    </CardTitle>
                    {badge?.type === "fulfilled" && (
                        <Badge
                            variant="secondary"
                            className="bg-meta-8 text-black dark:text-white whitespace-nowrap"
                        >
                            {badge.text}
                        </Badge>
                    )}
                    {icon && <div className="ml-auto">{icon}</div>}
                </div>
            </CardHeader>

            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span
                            className={`text-3xl font-bold ${isPrimary ? "text-white" : "text-black dark:text-white"
                                }`}
                        >
                            {amount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                        <USDTIcon className={`w-6 h-6 ${isPrimary ? "text-white" : ""}`} />
                    </div>
                    {badge?.type === "claimed" && (
                        <button
                            className="px-4 py-2 rounded-lg bg-meta-9 dark:bg-meta-4 text-black dark:text-white text-sm font-medium hover:bg-opacity-90 transition-all duration-200"
                        >
                            {badge.text}
                        </button>
                    )}
                </div>
                {typeof activeUsers === "number" && (
                    <div className="mt-4 text-right">
                        <p className="text-lg font-medium text-black dark:text-white">
                            {activeUsers} {t("incentiveCard.activeUsersLeft")}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default IncentiveCard;
