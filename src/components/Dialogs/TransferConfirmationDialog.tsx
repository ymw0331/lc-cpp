'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TransferConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    amount: number;
    currency: string;
}

const TransferConfirmationDialog = ({ isOpen, onClose, onConfirm, amount, currency }: TransferConfirmationProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[500px] dark:bg-boxdark-2">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Transfer to Current Account Wallet
                    </DialogTitle>
                    <DialogDescription className="text-base text-body dark:text-bodydark">
                        You are about to transfer {amount} {currency} to your Current Account Wallet
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">DISCLAIMERS</h3>

                    <div className="space-y-4 text-sm text-body dark:text-bodydark">
                        <p>a) Please ensure all details and amounts are correct before confirming the transaction. Once submitted, transactions cannot be reversed.</p>

                        <p>b) Transfers may be subject to delays due to network availability, processing time, or external factors beyond our control.</p>

                        <p>c) Applicable transaction fees, exchange rates, and processing charges will be displayed before confirmation (if any).</p>

                        <p>d) All transactions are encrypted for security. For added protection, please do not share your login credentials with others.</p>

                        <p>e) Lookcard Limited is not liable for incorrect details entered by the user.</p>

                        <p>f) Transactions may be reviewed in compliance with local and international anti-money laundering (AML) and counter-terrorism financing (CTF) regulations. This may lead to processing delays or cancellations.</p>
                    </div>
                </div>

                <DialogFooter className="sm:justify-between">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="w-[200px] bg-meta-9 dark:bg-meta-4 text-black dark:text-white hover:bg-meta-9/90 dark:hover:bg-meta-4/90"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="w-[200px] bg-primary hover:bg-primary/90 text-white"
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TransferConfirmationDialog;