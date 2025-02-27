"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Award, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MilestoneAchievementCardProps {
    activatedUsers: number;
    targetUsers: number;
    milestones: {
        months: number;
        reward: number;
        isCompleted?: boolean;
        isCurrent?: boolean;
    }[];
    className?: string;
}

const MilestoneAchievementCard = ({
    activatedUsers,
    targetUsers,
    milestones,
    className = "",
}: MilestoneAchievementCardProps) => {
    const { t } = useTranslation();

    // Determine current progress step
    const currentStep = milestones.findIndex(m => m.isCurrent) !== -1
        ? milestones.findIndex(m => m.isCurrent)
        : milestones.filter(m => m.isCompleted).length;

    // Calculate milestone positions based on months
    const getPosition = (index: number) => {
        const milestone = milestones[index];
        const firstMonth = milestones[0].months;
        const lastMonth = milestones[milestones.length - 1].months;
        const totalMonthSpan = lastMonth - firstMonth;
        return ((milestone.months - firstMonth) / totalMonthSpan) * 100;
    };

    return (
        <Card className={`border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-full ${className}`}>
            <CardHeader className="p-8">
                <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-gray-100 dark:bg-meta-4 p-4 w-14 h-14 flex items-center justify-center flex-shrink-0">
                        <Award />
                    </div>
                    <div className="space-y-1.5">
                        <CardTitle className="text-2xl font-bold text-black dark:text-white">
                            {t("milestoneAchievementCard.milestoneAchievementBonus")}
                            <span className="text-base text-gray-600 dark:text-gray-400 font-normal italic block md:inline">
                                [{t("milestoneAchievementCard.exclusivelyForLevel1")}]
                            </span>
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
                            {`${t("milestoneAchievementCard.achieveActivationsMessage").replace("{targetUsers}", targetUsers.toString())}`}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-8 pt-0">
                <div className="mt-6">
                    <div className="text-3xl font-bold text-primary">
                        {activatedUsers} <span className="text-xl text-gray-600 dark:text-gray-400 font-normal ml-2">{t("milestoneAchievementCard.activatedUsers")}</span>
                    </div>
                </div>

                {/* Desktop View */}
                <div className="mt-12 relative px-10 hidden md:block h-40">
                    {/* Progress line background - stops at last milestone */}
                    <div className="absolute h-1 bg-gray-200 dark:bg-meta-4 w-[calc(100%-4rem)] rounded-full top-6"></div>

                    {/* Colored progress line */}
                    <div
                        className="absolute h-1 bg-primary rounded-full top-6"
                        style={{
                            width: `${(currentStep / (milestones.length - 1)) * (100 - (100 / milestones.length))}%`
                        }}
                    ></div>

                    {/* Milestone steps */}
                    <div className="relative h-full">
                        {milestones.map((milestone, index) => {
                            const isGreyedOut = !milestone.isCompleted && !milestone.isCurrent;
                            const position = getPosition(index);

                            return (
                                <div
                                    key={index}
                                    className="absolute text-center"
                                    style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                                >
                                    {milestone.isCompleted ? (
                                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                                            <Lock className="text-white" size={20} />
                                        </div>
                                    ) : (
                                        <div className={`w-12 h-12 rounded-full ${milestone.isCurrent ? 'border-2 border-primary p-1 bg-white' : ''} ${isGreyedOut ? 'bg-gray-300' : 'bg-white border-2 border-primary'} flex items-center justify-center`}>
                                            <div className={`w-full h-full rounded-full ${isGreyedOut ? 'bg-gray-300' : milestone.isCurrent ? 'bg-white' : 'bg-white'}`}></div>
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        <div className={`text-lg font-bold ${isGreyedOut ? 'text-gray-400' : 'text-black dark:text-white'}`}>
                                            {milestone.months}                     {t("milestoneAchievementCard.months")}
                                        </div>
                                        <div className={`text-lg font-bold ${index === 0 ? 'text-[#f6a834]' : index === 1 ? 'text-[#f6be66]' : 'text-[#f6d499]'}`}>
                                            USD {milestone.reward}
                                        </div>
                                    </div>

                                    {milestone.isCompleted && (
                                        <div className="absolute top-32 left-1/2 -translate-x-1/2 text-green-500 font-medium whitespace-nowrap">
                                            {t("milestoneAchievementCard.congratulations")}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile View - remains the same */}
                <div className="mt-12 md:hidden">
                    <div className="space-y-8">
                        {milestones.map((milestone, index) => {
                            const isGreyedOut = !milestone.isCompleted && !milestone.isCurrent;
                            const isLast = index === milestones.length - 1;

                            return (
                                <div key={index} className="relative flex items-start gap-6">
                                    <div className="flex flex-col items-center">
                                        {milestone.isCompleted ? (
                                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                                                <Lock className="text-white" size={20} />
                                            </div>
                                        ) : (
                                            <div className={`w-12 h-12 rounded-full ${milestone.isCurrent ? 'border-2 border-primary p-1 bg-white' : ''} ${isGreyedOut ? 'bg-gray-300' : 'bg-white border-2 border-primary'} flex items-center justify-center`}>
                                                <div className={`w-full h-full rounded-full ${isGreyedOut ? 'bg-gray-300' : milestone.isCurrent ? 'bg-white' : 'bg-white'}`}></div>
                                            </div>
                                        )}
                                        {!isLast && (
                                            <div className={`w-0.5 h-14 mt-2 ${isGreyedOut ? 'bg-gray-200' : 'bg-primary'}`}></div>
                                        )}
                                    </div>

                                    <div className="pt-2">
                                        <div className={`text-lg font-bold ${isGreyedOut ? 'text-gray-400' : 'text-black dark:text-white'}`}>
                                            {milestone.months} Months
                                        </div>
                                        <div className={`text-lg font-bold ${index === 0 ? 'text-[#f6a834]' : index === 1 ? 'text-[#f6be66]' : 'text-[#f6d499]'}`}>
                                            USD {milestone.reward}
                                        </div>
                                        {milestone.isCompleted && (
                                            <div className="text-green-500 font-medium mt-4">
                                                {t("milestoneAchievementCard.congratulations")}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default MilestoneAchievementCard;