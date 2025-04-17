"use client"

import Link from "next/link";
import USDTIcon from "@/components/Icons/dashboard/USDTIcon";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface WalletCardProps {
    title: string;
    amount: number | null | undefined;
    icon: React.ReactNode;
    showTransfer?: boolean;
    className?: string;
}

const WalletCard = ({
    title,
    amount,
    icon,
    showTransfer,
    className = "",
}: WalletCardProps) => {
    const { t } = useTranslation();

    return (
        <Card className={`border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-full flex flex-col ${className}`}>
            <CardHeader className="p-6 pb-2 flex-initial">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray dark:bg-meta-4 flex items-center justify-center">
                        {icon}
                    </div>
                </div>

                <div>
                    <h4 className="text-base text-body dark:text-bodydark font-medium">
                        {title}
                    </h4>
                </div>
            </CardHeader>

            <CardContent className="p-6 pt-2 flex-1 flex items-end justify-between">
                <div className="mt-2 flex items-center gap-4">
                    <h4 className="text-2xl font-bold text-black dark:text-white">
                        $ {(amount ?? 0).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </h4>
                    <span>
                        <USDTIcon />
                    </span>
                </div>

                {showTransfer && (
                    <Link href="/account/transfer">
                        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm">
                            {t("walletCard.transferButton")}
                        </button>
                    </Link>
                )}
            </CardContent>
        </Card>
    )
}

export default WalletCard;