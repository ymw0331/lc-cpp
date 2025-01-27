'use client'

import { type TransferFormData, type TransferType } from '@/types/transfer'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface TransferConfirmationProps {
    data: TransferFormData
    onBack: () => void
    onTransfer: () => void
    currentTransferType: TransferType | undefined
}

export function TransferConfirmation({
    data,
    onBack,
    onTransfer,
    currentTransferType
}: TransferConfirmationProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 className="font-medium mb-4">Transfer To</h2>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="text-lg font-medium">{data.recipient.name}</div>
                    <div className="text-gray-500 text-sm">{data.recipient.email}</div>
                    <div className="mt-2 text-gray-600 text-sm font-mono">{data.recipient.walletAddress}</div>
                    <div className="mt-2 text-sm font-medium">{data.recipient.userId}</div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between">
                        <div>Transfer</div>
                        <div>$ {data.amount}</div>
                    </div>
                    <div className="flex justify-between">
                        <div>{currentTransferType?.feeLabel}</div>
                        <div>- $ {data.transferFee}</div>
                    </div>
                    <div className="flex justify-between font-medium">
                        <div>Total Amount Send</div>
                        <div>$ {data.totalAmount}</div>
                    </div>
                </div>

                <div className="mt-6">
                    <Label className="text-sm mb-2 block">Description</Label>
                    <Input
                        value={data.description}
                        readOnly
                        className="bg-white"
                    />
                </div>

                <div className="mt-4">
                    <Textarea
                        rows={4}
                        value={data.note}
                        readOnly
                        className="bg-white"
                    />
                </div>
            </div>

            <div>
                <h2 className="font-medium mb-4">Summary</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-600">Name:</div>
                        <div>{data.recipient.name}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-600">User ID:</div>
                        <div>{data.recipient.userId}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-600">Email:</div>
                        <div>{data.recipient.email}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-600">Wallet Address:</div>
                        <div className="break-all">{data.recipient.walletAddress}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-600">Transfer Amount:</div>
                        <div>$ {data.amount}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-600">{currentTransferType?.feeLabel}:</div>
                        <div>$ {data.transferFee}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-600">Total Amount:</div>
                        <div>$ {data.totalAmount}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-600">Description:</div>
                        <div>{data.description}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-600">Note:</div>
                        <div>{data.note}</div>
                    </div>
                </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-4">
                <Button
                    onClick={onBack}
                    variant="secondary"
                >
                    Back
                </Button>
                <Button
                    onClick={onTransfer}
                    className="bg-rose-500 hover:bg-rose-600"
                >
                    Transfer
                </Button>
            </div>
        </div>
    )
}

