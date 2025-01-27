'use client'

import { ChevronDown } from 'lucide-react'
import { type TransferFormData, type TransferType, type WalletType } from '@/types/transfer'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface TransferFormProps {
    formData: TransferFormData
    onFormDataChange: (data: TransferFormData) => void
    onSubmit: (e: React.FormEvent) => void
    getTransferTypes: () => TransferType[]
    getWalletTypes: () => WalletType[]
    descriptions: string[]
    availableBalance: string
    currentTransferType: TransferType | undefined
}

export function TransferForm({
    formData,
    onFormDataChange,
    onSubmit,
    getTransferTypes,
    getWalletTypes,
    descriptions,
    availableBalance,
    currentTransferType
}: TransferFormProps) {
    return (
        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
                <div>
                    <Label className="text-base font-medium mb-4 block">Transfer Type</Label>
                    <div className="space-y-2">
                        {getTransferTypes().map(type => (
                            <label key={type.id} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="transferType"
                                    value={type.id}
                                    checked={formData.transferType === type.id}
                                    onChange={(e) => onFormDataChange({
                                        ...formData,
                                        transferType: e.target.value as 'credit' | 'debit'
                                    })}
                                    className="w-4 h-4 text-rose-500 border-gray-300 focus:ring-rose-500"
                                />
                                <span className={cn(
                                    "text-sm",
                                    formData.transferType === type.id ? 'text-rose-500' : 'text-gray-700'
                                )}>
                                    {type.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <Label className="text-base font-medium mb-2 block">
                        {currentTransferType?.recipientLabel}
                    </Label>
                    <Input
                        type="text"
                        placeholder="Enter the Recipient"
                        value={formData.recipient.email}
                        onChange={(e) => onFormDataChange({
                            ...formData,
                            recipient: { ...formData.recipient, email: e.target.value }
                        })}
                    />
                </div>

                <div>
                    <Label className="text-base font-medium mb-4 block">
                        {currentTransferType?.walletLabel}
                    </Label>
                    <div className="space-y-3">
                        {getWalletTypes().map(type => (
                            <label key={type.id} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="walletType"
                                    value={type.id}
                                    checked={formData.walletType === type.id}
                                    onChange={(e) => onFormDataChange({
                                        ...formData,
                                        walletType: e.target.value as 'current' | 'credit' | 'reward'
                                    })}
                                    className="w-4 h-4 text-rose-500 border-gray-300 focus:ring-rose-500"
                                />
                                <span className={cn(
                                    "text-sm",
                                    formData.walletType === type.id ? 'text-rose-500' : 'text-gray-700'
                                )}>
                                    {type.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <Label className="text-base font-medium mb-2 block">Amount</Label>
                    <div className="text-sm text-gray-500 mb-2">
                        You have $ {availableBalance} available balance
                    </div>
                    <div className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <div>Enter the amount</div>
                            <div className="font-medium">$ {formData.amount}</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>{currentTransferType?.feeLabel}</div>
                            <div>- $ {formData.transferFee}</div>
                        </div>
                        <div className="flex justify-between items-center font-medium">
                            <div>Total Amount Send</div>
                            <div>$ {formData.totalAmount}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div>
                <div className="space-y-4">
                    <Label className="text-base font-medium block">Description:</Label>
                    <Select
                        value={formData.description}
                        onValueChange={(value) => onFormDataChange({ ...formData, description: value })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select description" />
                        </SelectTrigger>
                        <SelectContent>
                            {descriptions.map(desc => (
                                <SelectItem key={desc} value={desc}>
                                    {desc}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Textarea
                        className="h-[200px]"
                        value={formData.note}
                        onChange={(e) => onFormDataChange({ ...formData, note: e.target.value })}
                        placeholder="Please Specify"
                    />
                </div>
            </div>

            {/* Confirm Button */}
            <div className="md:col-span-2 flex md:justify-end">
                <Button
                    type="submit"
                    className="w-full md:w-auto bg-gray-500 hover:bg-gray-600"
                >
                    Confirm
                </Button>
            </div>
        </form>
    )
}

