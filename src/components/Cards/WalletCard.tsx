// WalletCard.tsx
import Link from "next/link";
import USDTIcon from "../Icons/dashboard/USDTIcon";
import { useTranslation } from "react-i18next";

interface WalletCardProps {
    title: string;
    amount: number | null | undefined;
    icon: React.ReactNode;
    secondaryAmount?: number | null;
    secondaryIcon?: React.ReactNode;
    showTransfer?: boolean;
}

const WalletCard = ({
    title,
    amount,
    icon,
    secondaryAmount,
    secondaryIcon,
    showTransfer,
}: WalletCardProps) => {
    const { t } = useTranslation();

    // Format amount with fallback
    const formatAmount = (value: number | null | undefined) => {
        if (value === null || value === undefined) return "0.00";
        return value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    return (
        <div className="p-4 sm:p-6 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark">
            {/* Icon and Title */}
            <div className="flex flex-col gap-3 sm:gap-6 mb-3 sm:mb-4">
                <div className="flex w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10">
                    {icon}
                </div>
                <h3 className="flex text-base sm:text-lg text-black/60 dark:text-white/60">
                    {title}
                </h3>
            </div>

            {/* Amounts Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-14">
                    {/* Primary Amount */}
                    <div className="flex items-center gap-2">
                        <span className="text-2xl sm:text-[32px] font-bold text-black dark:text-white">
                            {formatAmount(amount)}
                        </span>
                        <USDTIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    {/* Secondary Amount if exists */}
                    {secondaryAmount !== undefined && (
                        <div className="flex items-center gap-2">
                            <span className="text-2xl sm:text-[32px] font-bold text-black dark:text-white">
                                {formatAmount(secondaryAmount)}
                            </span>
                            <div className="w-5 h-5 sm:w-6 sm:h-6">{secondaryIcon}</div>
                        </div>
                    )}
                </div>

                {/* Transfer Button */}
                {showTransfer && (
                    <Link href="/account/transfer" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base">
                            {t("walletCard.transferButton")}
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default WalletCard;