"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import TransferConfirmationDialog from "../Dialogs/TransferConfirmationDialog";
import { useTranslation } from "react-i18next";

interface Currency {
    name: string;
    icon: React.ReactNode;
}

interface WalletTransferProps {
    sourceAmount: number;
    sourceIcon: React.ReactNode;
    currencies: Currency[];
    onTransfer: (amount: number, currency: string) => void;
}

const WalletTransferForm = ({
    sourceAmount,
    sourceIcon,
    currencies,
    onTransfer,
}: WalletTransferProps) => {
    const [selectedCurrency, setSelectedCurrency] = useState(currencies[0].name);
    const [amount, setAmount] = useState(sourceAmount.toString());
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [error, setError] = useState("");
    const { t } = useTranslation();

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Allow only numbers and decimal point
        if (!/^\d*\.?\d*$/.test(value)) {
            return;
        }

        setAmount(value);
        setError("");

        // Validate amount
        const numAmount = Number(value);
        if (numAmount > sourceAmount) {
            setError("Amount exceeds available balance");
        } else if (numAmount <= 0) {
            setError("Amount must be greater than 0");
        }
    };

    const handleTransfer = () => {
        if (!error && amount) {
            setShowConfirmation(true);
        }
    };

    const handleConfirm = () => {
        onTransfer(Number(amount), selectedCurrency);
        setShowConfirmation(false);
        setAmount("");
    };

    return (
        <div className="p-4 sm:p-6 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark">
            <h3 className="text-base sm:text-lg text-black/60 dark:text-white/60 mb-3 sm:mb-4">
                {t("walletTransferForm.rewardWalletBalance")}
            </h3>

            <div className="flex items-center gap-2 mb-6 sm:mb-8">
                <span className="text-2xl sm:text-[32px] font-bold text-black dark:text-white">
                    {sourceAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </span>
                <div className="w-5 h-5 sm:w-6 sm:h-6">{sourceIcon}</div>
            </div>

            <div className="space-y-4 sm:space-y-6">
                <div>
                    <h4 className="text-base sm:text-lg text-black/60 dark:text-white/60 mb-3 sm:mb-4">
                        {t("walletTransferForm.selectCurrencyWallet")}
                    </h4>
                    <RadioGroup
                        value={selectedCurrency}
                        onValueChange={setSelectedCurrency}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                    >
                        {currencies.map((currency) => (
                            <div
                                key={currency.name}
                                className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg w-full cursor-pointer ${selectedCurrency === currency.name
                                        ? "bg-primary/10 dark:bg-primary/10"
                                        : "bg-gray-2 dark:bg-meta-4"
                                    }`}
                            >
                                <RadioGroupItem value={currency.name} id={currency.name} />
                                <div className="w-5 h-5 sm:w-6 sm:h-6">{currency.icon}</div>
                                <label
                                    htmlFor={currency.name}
                                    className="text-sm sm:text-base font-medium cursor-pointer"
                                >
                                    {currency.name}
                                </label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <div>
                    <h4 className="text-base sm:text-lg text-black/60 dark:text-white/60 mb-3 sm:mb-4">
                        {t("walletTransferForm.enterTransferAmount")}
                    </h4>
                    <div className="relative">
                        <Input
                            type="text"
                            value={amount}
                            onChange={handleAmountChange}
                            className={`pr-24 sm:pr-32 h-10 sm:h-12 bg-gray-2 dark:bg-meta-4 border-0 text-sm sm:text-base ${error ? "border-red-500 focus:border-red-500" : ""
                                }`}
                            placeholder="0.00"
                        />
                        <Button
                            variant="secondary"
                            className="absolute right-1 top-1 bottom-1 bg-black text-white hover:bg-black/90 text-xs sm:text-sm px-2 sm:px-4"
                            onClick={() => setAmount(sourceAmount.toString())}
                        >
                            {t("walletTransferForm.fullAmountButton")}
                        </Button>
                    </div>
                    {error && (
                        <p className="mt-2 text-xs sm:text-sm text-red-500">{error}</p>
                    )}
                </div>

                <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between text-sm sm:text-base mb-1 sm:mb-2">
                        <span className="text-black/60 dark:text-white/60">
                            {t("walletTransferForm.transferFee")}
                        </span>
                        <span className="font-medium">0.00</span>
                    </div>

                    <div className="flex justify-between text-sm sm:text-base mb-4 sm:mb-6">
                        <span className="text-black/60 dark:text-white/60">
                            {t("walletTransferForm.totalAmountTransferred")}
                        </span>
                        <span className="font-bold">{amount}</span>
                    </div>
                </div>

                <Button
                    className="w-full sm:w-40 mx-auto block bg-primary hover:bg-primary/90 text-white h-10 sm:h-12 text-sm sm:text-base"
                    onClick={handleTransfer}
                    disabled={!!error || !amount}
                >
                    {t("walletTransferForm.transferButton")}
                </Button>

                <TransferConfirmationDialog
                    isOpen={showConfirmation}
                    onClose={() => setShowConfirmation(false)}
                    onConfirm={handleConfirm}
                    amount={Number(amount)}
                    currency={selectedCurrency}
                />
            </div>
        </div>
    );
};

export default WalletTransferForm;
