"use client";

import {
    Card,
    CardContent,
    CardHeader
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface AgentRecruitmentSummaryProps {
    directRecruitVolume?: number | null;
    depositVolume?: number | null;
    className?: string;
    periodOptions?: string[];
    selectedPeriod?: string;
    onPeriodChange?: (value: string) => void;
}

const AgentRecruitmentSummaryCard = ({
    directRecruitVolume = null,
    depositVolume = null,
    className = "",
    periodOptions = ["Month", "Week", "Year"],
    selectedPeriod = "Month",
    onPeriodChange,
}: AgentRecruitmentSummaryProps) => {
    const { t } = useTranslation();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <Card className={`border-stroke bg-gray-50 shadow-default dark:border-gray-700 dark:bg-gray-800 pointer-events-none ${className}`}>
            <CardHeader className="p-6 pb-4 flex flex-row justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                stroke="#9CA3AF"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                            <path
                                d="M12 6V12L16 14"
                                stroke="#9CA3AF"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-400 dark:text-gray-500 uppercase">
                        {t("agentRecruitmentSummaryCard.agentRecruitmentSummary")}
                    </h2>
                </div>

                <Select value={selectedPeriod} onValueChange={onPeriodChange} disabled>
                    <SelectTrigger className="w-[140px] border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500">
                        <SelectValue placeholder={t("common.selectPeriod")} />
                    </SelectTrigger>
                    <SelectContent>
                        {periodOptions.map((period) => (
                            <SelectItem key={period} value={period}>
                                {period}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="p-0">
                <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
                    {/* Direct Recruit Agent Volume */}
                    <div className="grid grid-cols-2 items-center">
                        <div className="p-6 bg-gray-100 dark:bg-gray-700 flex items-center">
                            <div className="text-center w-full">
                                <p className="text-base font-bold text-gray-400 dark:text-gray-500">
                                    {t("agentRecruitmentSummaryCard.directRecruitVolumeLabel")}
                                </p>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-3xl font-bold text-gray-400 dark:text-gray-500 text-center">
                                {directRecruitVolume !== null ? directRecruitVolume : "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Direct Recruit Agents' Deposit Volume */}
                    <div className="grid grid-cols-2 items-center">
                        <div className="p-6 bg-gray-100 dark:bg-gray-700 flex items-center">
                            <div className="text-center w-full">
                                <p className="text-base font-bold text-gray-400 dark:text-gray-500">
                                    {t("agentRecruitmentSummaryCard.depositVolumeLabel")}
                                </p>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-3xl font-bold text-gray-400 dark:text-gray-500 text-center">
                                {depositVolume !== null ? formatCurrency(depositVolume) : "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AgentRecruitmentSummaryCard;