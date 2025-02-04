// src/components/cards/AgentLevelCard.tsx
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Users2Icon, UserPlusIcon } from "lucide-react";

interface AgentLevelCardProps {
    level: string;
    count: number;
    type: 'recruit' | 'referral';
}

const AgentLevelCard = ({ level, count, type }: AgentLevelCardProps) => {
    const Icon = type === 'recruit' ? Users2Icon : UserPlusIcon;

    return (
        <Card className="bg-[#F9FAFB] dark:bg-boxdark border-none">
            <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-xl text-[#6B7280] dark:text-bodydark2 font-normal">
                        {level}
                    </h4>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE2E2] dark:bg-[#FEE2E2]/80">
                        <Icon className="h-6 w-6 text-[#EF4444] dark:text-[#EF4444]/90" />
                    </div>
                </div>
                <div>
                    <h3 className="text-4xl font-bold text-black dark:text-white">
                        {count}
                    </h3>
                </div>
            </CardContent>
        </Card>
    );
};

export default AgentLevelCard;