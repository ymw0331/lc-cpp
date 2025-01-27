'use client'

import { Button } from '@/components/ui/button'
import { CheckIcon } from 'lucide-react'

interface TransferSuccessModalProps {
    onClose: () => void
}

export function TransferSuccessModal({ onClose }: TransferSuccessModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckIcon className="w-8 h-8 text-green-500 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Transfer Successful</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Your transfer has been completed successfully.
                </p>
                <Button
                    onClick={onClose}
                    className="bg-rose-500 hover:bg-rose-600"
                >
                    Make Another Transfer
                </Button>
            </div>
        </div>
    )
}

