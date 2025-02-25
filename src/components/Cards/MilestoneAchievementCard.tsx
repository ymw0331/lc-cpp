"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Lock } from "lucide-react";
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

    return (
        <Card className={`border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-full ${className}`}>
            <CardHeader className="p-6 pb-0">
                <div className="flex items-start gap-3">
                    <div className="rounded-md bg-gray-100 dark:bg-meta-4 p-2">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                fill="#7C74FF"
                                stroke="#7C74FF"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold text-black dark:text-white uppercase">
                            {t("milestoneAchievementCard.milestoneAchievementBonus")}
                            <span className="text-sm font-normal text-body dark:text-bodydark ml-2 italic">
                                [{t("milestoneAchievementCard.exclusivelyForLevel1")}]
                            </span>
                        </CardTitle>
                        <CardDescription className="text-body dark:text-bodydark mt-1">
                            {t("milestoneAchievementCard.achieveActivationsMessage", { targetUsers })}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6">
                <div className="mt-4">
                    <div className="text-2xl font-bold text-primary">
                        {activatedUsers} <span className="text-xl text-body dark:text-bodydark font-normal">{t("milestoneAchievementCard.activatedUsers")}</span>
                    </div>
                </div>

                {/* Milestone Timeline */}
                <div className="mt-8 relative">
                    {/* Progress line background */}
                    <div className="absolute h-1 bg-gray-200 dark:bg-meta-4 w-full rounded-full top-6"></div>

                    {/* Colored progress line */}
                    <div
                        className="absolute h-1 bg-primary w-full rounded-full top-6"
                        style={{
                            width: `${(currentStep / (milestones.length - 1)) * 100}%`
                        }}
                    ></div>

                    {/* Milestone steps */}
                    <div className="flex justify-between relative">
                        {milestones.map((milestone, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className="relative">
                                    {milestone.isCompleted ? (
                                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center z-10">
                                            <Lock className="text-white" size={20} />
                                        </div>
                                    ) : (
                                        <div className={`w-12 h-12 rounded-full ${milestone.isCurrent ? 'border-2 border-primary' : ''} bg-gray-200 dark:bg-meta-4 flex items-center justify-center z-10`}>
                                            <div className="w-5 h-5 rounded-full bg-white"></div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-2 text-center">
                                    <div className="text-lg font-bold text-black dark:text-white">
                                        {milestone.months} {milestone.months === 1
                                            ? t("milestoneAchievementCard.month")
                                            : t("milestoneAchievementCard.months")}
                                    </div>
                                    <div className={`font-bold ${index === 0 ? 'text-[#f6a834]' : index === 1 ? 'text-[#f6be66]' : 'text-[#f6d499]'}`}>
                                        USD {milestone.reward}
                                    </div>
                                </div>

                                {index === milestones.length - 1 && (
                                    <div className="absolute right-0 top-16 translate-y-10 text-success font-medium">
                                        {t("milestoneAchievementCard.congratulations")}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default MilestoneAchievementCard;