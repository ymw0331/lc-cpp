"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

interface NextLevelCardProps {
    currentLevel: string;
    progress: number;
    isMaxLevel?: boolean;
    avatarUrl?: string;
    name?: string;
    className?: string;
}

const NextLevelCard = ({
    currentLevel,
    progress,
    isMaxLevel,
    avatarUrl,
    name,
    className,
}: NextLevelCardProps) => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { user } = useAuth();

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleLevelUpRequest = () => {
        // toast({
        //     title: t("nextLevelCard.levelUpRequestSentTitle"),
        //     description: t("nextLevelCard.levelUpRequestSentDescription"),
        //     duration: 3000,
        // });
    };

    const getLevelDisplay = (level: string) => {
        if (typeof level === "number") {
            return `${t("nextLevelCard.level")} ${level}`;
        }
        return level;
    };

    const displayName = name || user?.fullName || t("nextLevelCard.user");

    return (
        <Card className={cn(
            "border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark",
            className
        )}>
            <CardHeader className="pb-2">
                <CardTitle className="text-title-sm font-normal text-bodydark2 dark:text-bodydark">
                    {t("nextLevelCard.nextLevel")}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-7.5">
                    <h2 className="text-title-lg font-bold text-black dark:text-white">
                        {isMaxLevel
                            ? t("nextLevelCard.maxLevelMessage")
                            : t("nextLevelCard.progressMessage")}
                    </h2>

                    <div className="mt-4 flex items-center justify-between">
                        <Avatar className="relative h-15 w-15 rounded-full bg-gray-2 dark:bg-meta-4">
                            <AvatarFallback className="bg-primary/10">
                                {getInitials(displayName)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-title-xsm font-medium text-black dark:text-white">
                                {getLevelDisplay(currentLevel)}
                            </span>
                            <span className="text-title-xsm font-medium text-black dark:text-white ml-2">
                                -
                            </span>
                            <span className="text-title-xsm font-medium text-black dark:text-white ml-2">
                                {progress}%
                            </span>
                        </div>

                        <div className="relative h-3 w-full rounded-full bg-stroke dark:bg-strokedark">
                            <div
                                className="h-full rounded-full bg-chart-primary transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* <Button
                        onClick={handleLevelUpRequest}
                        className="whitespace-nowrap rounded-lg bg-bodydark1 px-6 py-3 font-medium text-black hover:bg-bodydark2 dark:bg-meta-4 dark:text-white dark:hover:bg-meta-4/80 transition-all duration-200"
                        disabled={!isMaxLevel}
                    >
                        {t("nextLevelCard.requestLevelUpButton")}
                    </Button> */}
                </div>
            </CardContent>
        </Card>
    );
};

export default NextLevelCard;
