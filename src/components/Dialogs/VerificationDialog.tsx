"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface VerificationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    type: "email" | "phone";
    onVerify: (code: string) => void;
    onResend: () => void;
    contactDetail?: string;
}

export const VerificationDialog = ({
    isOpen,
    onOpenChange,
    type,
    onVerify,
    onResend,
    contactDetail,
}: VerificationDialogProps) => {
    const [code, setCode] = useState("");

    const messages = {
        phone: {
            title: "Phone Verification",
            description: `To update your contact number, we need to verify your identity. An OTP (One-Time Password) has been sent to your registered phone number ending in ${contactDetail}. Please enter code to proceed.`,
        },
        email: {
            title: "Email Verification",
            description: `To update your email address, we need to verify your identity. An OTP (One-Time Password) has been sent to your registered email. Please enter code to proceed.`,
        },
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-6 bg-white dark:bg-boxdark p-8 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-xl">
                    <Dialog.Title className="text-2xl font-bold text-center text-black dark:text-white">
                        {messages[type].title}
                    </Dialog.Title>

                    <Dialog.Description className="text-center text-body dark:text-bodydark text-base leading-relaxed">
                        {messages[type].description}
                    </Dialog.Description>

                    <div className="relative">
                        <Input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter OTP"
                            className="w-full pr-24 bg-gray dark:bg-form-input border-stroke dark:border-strokedark text-black dark:text-white focus:border-primary"
                        />
                        <Button
                            onClick={onResend}
                            variant="ghost"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/90 hover:bg-transparent"
                        >
                            Resend OTP
                        </Button>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <Button
                            onClick={() => onOpenChange(false)}
                            variant="outline"
                            className="flex-1 bg-meta-2 dark:bg-meta-4 text-black dark:text-white border-stroke dark:border-strokedark hover:bg-meta-2/90 dark:hover:bg-meta-4/90"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => onVerify(code)}
                            className="flex-1 bg-primary hover:bg-primary/90 text-white"
                        >
                            Verify
                        </Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
