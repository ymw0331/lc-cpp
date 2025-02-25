"use client";

import UserProfileIcon from "../Icons/dashboard/UserProfileIcon";
import { useTranslation } from "react-i18next";
import {
    Card,
    CardContent,
} from "@/components/ui/card";

interface RecruitCardProps {
    count: number;
    agentsToPartner: {
        count: number;
        trend?: "up" | "down"; // Optional trend for flexibility
    };
}

const RecruitCard = ({ count, agentsToPartner }: RecruitCardProps) => {
    const { t } = useTranslation();

    return (
        <Card className="border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-[#8A8AA3] text-lg font-medium mb-4">
                            {t("recruitCard.totalDirectRecruitLabel")}
                        </h3>
                        <p className="text-[2.5rem] font-bold text-black dark:text-white leading-tight">
                            {count.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <div className="w-12 h-12 rounded-full bg-[#FFF1E3] flex items-center justify-center mb-2">
                            <UserProfileIcon />
                        </div>

                        <div className="flex items-center gap-2">
                            {agentsToPartner.trend && (
                                <svg
                                    className={`w-5 h-5 ${agentsToPartner.trend === "down" ? "text-danger" : "text-success"}`}
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    {agentsToPartner.trend === "down" ? (
                                        <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
                                    ) : (
                                        <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
                                    )}
                                </svg>
                            )}

                            <span className="text-xl font-bold text-black dark:text-white">
                                {agentsToPartner.count}
                            </span>

                            <p className="text-[#8A8AA3] text-sm">
                                {t("recruitCard.agentsToPartnerLabel")}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default RecruitCard;