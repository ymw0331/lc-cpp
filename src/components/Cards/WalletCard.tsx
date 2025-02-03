import Link from "next/link";
import USDTIcon from "../Icons/dashboard/USDTIcon";

interface WalletCardProps {
    title: string;
    amount: number;
    icon: React.ReactNode;
    secondaryAmount?: number;
    secondaryIcon?: React.ReactNode;
    showTransfer?: boolean;
}

const WalletCard = ({ title, amount, icon, secondaryAmount, secondaryIcon, showTransfer }: WalletCardProps) => {

    return (
        <div className="p-6 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark">
            {/* Icon and Title */}
            <div className="flex flex-col gap-6 mb-4">
                <div className="flex w-10 h-10 rounded-lg bg-primary/10">
                    {icon}
                </div>
                <h3 className="flex text-lg text-black/60 dark:text-white/60">{title}
                </h3>
            </div>

            {/* Amounts Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-14">
                    {/* Primary Amount */}
                    <div className="flex items-center gap-2">
                        <span className="text-[32px] font-bold text-black dark:text-white">
                            {amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <USDTIcon className="w-6 h-6" />
                    </div>

                    {/* Secondary Amount if exists */}
                    {secondaryAmount && (
                        <div className="flex items-center gap-2">
                            <span className="text-[32px] font-bold text-black dark:text-white">
                                {secondaryAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            {secondaryIcon}
                        </div>
                    )}
                </div>

                {/* Transfer Button */}
                {showTransfer && (
                    <Link href="/account/transfer">
                        <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                            Transfer
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default WalletCard;