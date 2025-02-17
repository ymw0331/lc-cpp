"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react"; // Changed from ElementType
import { useTranslation } from "react-i18next";

interface AgentLevelCardProps {
    level: string;
    count: number;
    icon: ReactNode; // Changed to ReactNode to accept JSX elements
}

const AgentLevelCard = ({ level, count, icon }: AgentLevelCardProps) => {
    const { t } = useTranslation();

    return (
        <Card className="bg-white dark:bg-boxdark border-none shadow-card">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-8">
                    <h3 className="text-gray-500 text-lg">{level}</h3>
                    <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                        {icon} {/* Direct render of the icon */}
                    </div>
                </div>
                <p className="text-3xl font-bold">{count}</p>
            </CardContent>
        </Card>
    );
};

export default AgentLevelCard;
