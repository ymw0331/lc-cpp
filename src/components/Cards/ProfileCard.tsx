"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";

interface ProfileCardProps {
    name: string;
    level: string;
    activeUsers: {
        current: number;
        target: number;
        percentage: number;
        remaining: number;
    };
    avatar?: string;
}

const ProfileCard = ({
    name,
    level,
    activeUsers,
    avatar,
}: ProfileCardProps) => {
    const { t } = useTranslation();

    return (
        <Card className="border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <CardHeader className="p-6 pb-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-black dark:text-white">{name}</h2>
                        <p className="text-lg text-body dark:text-bodydark mt-1">Level {level}</p>
                    </div>
                    <div className="relative w-20 h-20 rounded-full bg-[#F3F3F3] dark:bg-meta-4 overflow-hidden">
                        {avatar ? (
                            <Image src={avatar} alt={name} className="w-full h-full object-cover" width={80} height={80} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#7C74FF]">
                                {name.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6">
                {/* Users Count Section */}
                <div className="mt-8">
                    <div className="flex items-center gap-2">
                        <span className="text-4xl font-bold text-black dark:text-white">
                            {activeUsers.current.toLocaleString()}
                        </span>
                        <span className="text-2xl text-body dark:text-bodydark">
                            / {activeUsers.target.toLocaleString()} {t("profileCard.activeUsersLabel")}
                        </span>
                    </div>
                </div>

                {/* Progress Section */}
                <div className="mt-4 flex items-center gap-4">
                    <div className="flex-1 h-2.5 bg-chart-secondary dark:bg-meta-4 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-chart-primary rounded-full transition-all duration-300 ease-in-out"
                            style={{ width: `${activeUsers.percentage}%` }}
                        />
                    </div>
                    <span className="text-2xl font-bold text-chart-primary">
                        {activeUsers.percentage}%
                    </span>
                </div>

                {/* Remaining Count */}
                <div className="mt-4 flex items-center">
                    <span className="text-3xl font-bold text-black dark:text-white">
                        {activeUsers.remaining.toLocaleString()}
                    </span>
                    <span className="text-2xl text-body dark:text-bodydark ml-2">
                        {t("agentDashboard.left")}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProfileCard;