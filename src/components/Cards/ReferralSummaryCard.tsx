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

interface ReferralSummaryCardProps {
    directReferralsCount: number;
    totalDepositFromDirectReferrals: number | null;
    className?: string;
    periodOptions?: string[];
    selectedPeriod?: string;
    onPeriodChange?: (value: string) => void;
}

const ReferralSummaryCard = ({
    directReferralsCount,
    totalDepositFromDirectReferrals,
    className = "",
    periodOptions = ["Month", "Week", "Year"],
    selectedPeriod = "Month",
    onPeriodChange,
}: ReferralSummaryCardProps) => {
    const { t } = useTranslation();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <Card className={`border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${className}`}>
            <CardHeader className="p-6 pb-4 flex flex-row justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-amber-500/20 dark:from-primary/10 dark:to-amber-500/10 overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-amber-500 opacity-10"></div>
                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="relative z-10"
                        >
                            <path
                                d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                                className="fill-primary"
                                stroke="none"
                            />
                            <path
                                d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22"
                                className="stroke-primary"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-black dark:text-white uppercase">
                        {t("referralSummaryCard.referralSummary")}
                    </h2>
                </div>

                {/* <Select value={selectedPeriod} onValueChange={onPeriodChange}>
                    <SelectTrigger className="w-[140px] border-stroke dark:border-strokedark bg-white dark:bg-boxdark">
                        <SelectValue placeholder={t("common.selectPeriod")} />
                    </SelectTrigger>
                    <SelectContent>
                        {periodOptions.map((period) => (
                            <SelectItem key={period} value={period}>
                                {period}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select> */}
            </CardHeader>

            <CardContent className="p-0">
                <div className="flex flex-col divide-y divide-stroke dark:divide-strokedark">
                    <div className="grid grid-cols-2 items-center">
                        <div className="p-6 bg-gray-100 dark:bg-meta-4 flex items-center">
                            <div className="mr-3 text-primary">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
                                    <path d="M8 10H3V19H8V10Z" className="fill-primary" />
                                    <path d="M21 10H16V19H21V10Z" className="fill-primary" />
                                    <path d="M14.5 10H9.5V19H14.5V10Z" className="fill-primary" />
                                    <path d="M12 3L21 9H3L12 3Z" className="fill-primary" />
                                </svg>
                            </div>
                            <div className="text-start">
                                <p className="text-base font-bold text-black dark:text-white">
                                    {t("referralSummaryCard.noOfDirectReferral")}
                                </p>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-3xl text-center font-bold text-black dark:text-white">
                                {directReferralsCount}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 items-center">
                        <div className="p-6 flex items-center">
                            <div className="mr-3 text-primary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 8V6C2 4.89543 2.89543 4 4 4H20C21.1046 4 22 4.89543 22 6V8M2 8V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V8M2 8H22M16 14C16 12.8954 15.1046 12 14 12H10C8.89543 12 8 12.8954 8 14V14C8 15.1046 8.89543 16 10 16H14C15.1046 16 16 15.1046 16 14V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div className="text-start">
                                <p className="text-base font-bold text-black dark:text-white">
                                    {t("referralSummaryCard.totalDepositFromDirectReferral")}
                                </p>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-3xl font-bold text-black dark:text-white text-center">
                                {totalDepositFromDirectReferrals !== null && totalDepositFromDirectReferrals !== undefined
                                    ? formatCurrency(totalDepositFromDirectReferrals)
                                    : t("common.notAvailable")}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ReferralSummaryCard;