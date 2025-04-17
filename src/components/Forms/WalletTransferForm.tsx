"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TransferConfirmationDialog from "@/components/Dialogs/TransferConfirmationDialog";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

interface Currency {
    name: string;
    icon: React.ReactNode;
}

interface WalletTransferProps {
    sourceAmount: number;
    sourceIcon: React.ReactNode;
    currencies: Currency[];
    onTransfer: (amount: number, currency: string) => void;
    isLoading?: boolean;
}

const WalletTransferForm = ({
    sourceAmount,
    sourceIcon,
    currencies,
    onTransfer,
    isLoading = false
}: WalletTransferProps) => {
    const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]?.name || "USDT");
    const [amount, setAmount] = useState("");
    const [formattedAmount, setFormattedAmount] = useState("0.00");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [error, setError] = useState("");
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);
    const [cursorPosition, setCursorPosition] = useState(0);

    // Initialize amount when component loads
    useEffect(() => {
        setFormattedAmount("0.00");
    }, []);

    const formatAmount = (value: string): string => {
        // Remove non-numeric characters
        const numericValue = value.replace(/[^\d]/g, "");
        
        // Handle empty or zero values
        if (!numericValue || numericValue === "0") {
            return "0.00";
        }
        
        // Convert to decimal format (divide by 100 to get 2 decimal places)
        const numericAmount = parseInt(numericValue, 10) / 100;
        return numericAmount.toFixed(2);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Get the raw value without currency symbol
        const rawValue = e.target.value.replace(/[$\s,]/g, "");
        
        // Only proceed if the input is valid
        if (!/^[\d.]*$/.test(rawValue)) {
            return;
        }

        // Format the value
        const newFormattedValue = formatAmount(rawValue.replace(".", ""));
        setFormattedAmount(newFormattedValue);
        setAmount(newFormattedValue);
        
        // Clear error if present
        setError("");
        
        // Validate amount
        const numAmount = Number(newFormattedValue);
        if (numAmount > sourceAmount) {
            setError(t("walletTransferForm.errorExceedsBalance"));
        } else if (numAmount <= 0 && newFormattedValue !== "0.00") {
            setError(t("walletTransferForm.errorMustBePositive"));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (inputRef.current) {
            const input = inputRef.current;
            const curPos = input.selectionStart || 0;
            const value = input.value.replace(/[$\s,]/g, "");
            
            // Handle backspace - special handling for decimal point
            if (e.key === "Backspace") {
                // If cursor is just after the decimal, don't allow deleting it
                if (curPos === value.indexOf(".") + 1) {
                    e.preventDefault();
                    
                    // Move cursor before the decimal point
                    setTimeout(() => {
                        if (inputRef.current) {
                            inputRef.current.setSelectionRange(curPos - 1, curPos - 1);
                        }
                    }, 0);
                }
            }
            
            // Don't allow deleting the dollar sign
            if (e.key === "Backspace" && curPos <= 2) {
                e.preventDefault();
            }
        }
    };

    const handleSetMaxAmount = () => {
        // Use the exact source amount without rounding down
        const maxAmount = sourceAmount.toFixed(2);
        setFormattedAmount(maxAmount);
        setAmount(maxAmount);
        setError("");
    };

    const handleTransfer = () => {
        const numAmount = Number(amount);
        if (!error && amount && numAmount > 0 && numAmount <= sourceAmount) {
            setShowConfirmation(true);
        }
    };

    const handleConfirm = () => {
        onTransfer(Number(amount), selectedCurrency);
        setShowConfirmation(false);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        // Select all text when focused
        e.target.select();
    };

    return (
        <Card className="border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <CardHeader className="p-6 pb-2">
                <h3 className="text-base sm:text-lg text-black/60 dark:text-white/60">
                    {t("walletTransferForm.rewardWalletBalance")}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <i>
                        {t("walletTransferForm.rewardWalletBalanceDescription")}
                    </i>
                </p>
            </CardHeader>

            <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6 sm:mb-8">
                    <span className="text-2xl sm:text-[32px] font-bold text-black dark:text-white">
                        $ {sourceAmount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </span>
                    <div className="w-5 h-5 sm:w-6 sm:h-6">{sourceIcon}</div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                    {/* TODO: add more currencies in the future */}
                    {/* <div>
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
                    </div> */}

                    <div>
                        <h4 className="text-base sm:text-lg text-black/60 dark:text-white/60 mb-3 sm:mb-4">
                            {t("walletTransferForm.enterTransferAmount")}
                        </h4>

                        <div className="relative">
                            <Input
                                ref={inputRef}
                                type="text"
                                value={`$ ${formattedAmount}`}
                                onChange={handleAmountChange}
                                onKeyDown={handleKeyDown}
                                onFocus={handleFocus}
                                className={`pr-24 sm:pr-32 h-10 sm:h-12 bg-gray-2 dark:bg-meta-4 border-0 text-sm sm:text-base ${error ? "border-red-500 focus:border-red-500" : ""}`}
                                placeholder="$ 0.00"
                                inputMode="decimal"
                                disabled={isLoading}
                            />
                            <Button
                                variant="secondary"
                                className="absolute right-1 top-1 bottom-1 min-w-[90px] bg-black text-white hover:bg-black/90 text-sm px-3 h-[calc(100%-8px)]"
                                onClick={handleSetMaxAmount}
                                disabled={isLoading}
                            >
                                {t("walletTransferForm.fullAmountButton")}
                            </Button>
                        </div>
                        {error && (
                            <p className="mt-2 text-xs sm:text-sm text-red-500">{error}</p>
                        )}
                    </div>

                    <div className="space-y-2 sm:space-y-3">

                        {/* Todo: add transfer fee in the future */}
                        {/* <div className="flex justify-between text-sm sm:text-base mb-1 sm:mb-2">
                            <span className="text-black/60 dark:text-white/60">
                                {t("walletTransferForm.transferFee")}
                            </span>
                            <span className="font-medium">0.00</span>
                        </div> */}

                        <div className="flex justify-between text-sm sm:text-base mb-4 sm:mb-6">
                            <span className="text-black/60 dark:text-white/60">
                                {t("walletTransferForm.totalAmountTransferred")}
                            </span>
                            <span className="font-bold">{`$ ${formattedAmount}`}</span>
                        </div>
                    </div>

                    <Button
                        className="w-full sm:w-40 mx-auto block bg-primary hover:bg-primary/90 text-white h-10 sm:h-12 text-sm sm:text-base relative"
                        onClick={handleTransfer}
                        disabled={
                            !!error || 
                            !formattedAmount || 
                            formattedAmount === "0.00" || 
                            isLoading || 
                            parseFloat(amount) > sourceAmount + 0.001
                        }
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <Loader2 className="h-5 w-5 animate-spin" />
                            </div>
                        ) : (
                            t("walletTransferForm.transferButton")
                        )}
                    </Button>

                    <TransferConfirmationDialog
                        isOpen={showConfirmation}
                        onClose={() => setShowConfirmation(false)}
                        onConfirm={handleConfirm}
                        amount={Number(amount)}
                        currency={selectedCurrency}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default WalletTransferForm;
