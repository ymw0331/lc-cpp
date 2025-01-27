'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { TransferForm } from '@/components/transfer/transfer-form'
import { TransferConfirmation } from '@/components/transfer/transfer-confirmation'
import { TransferSuccessModal } from '@/components/transfer/transfer-success-modal'
import { type TransferFormData, type TransferType, type WalletType } from '@/types/transfer'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { transferDescriptionsData } from "@/lib/data"

export default function TransferPage() {
    const [step, setStep] = useState<'form' | 'confirmation'>('form')
    const [showSuccess, setShowSuccess] = useState(false)
    const [formData, setFormData] = useState<TransferFormData>({
        transferType: 'credit',
        recipient: {
            email: '',
            name: '',
            userId: '',
            walletAddress: ''
        },
        walletType: 'current',
        amount: '',
        transferFee: '0.00',
        totalAmount: '0.00',
        description: '',
        note: ''
    })

    const getTransferTypes = (): TransferType[] => [
        {
            id: 'credit',
            label: 'Send/Transfer Credit (transferred to recipient)',
            recipientLabel: 'Send To Recipient:',
            walletLabel: 'Transfer To*',
            feeLabel: 'Transfer Fee'
        },
        {
            id: 'debit',
            label: 'Reverse/Refund (taken out from recipient)',
            recipientLabel: 'Reverse On Recipient:',
            walletLabel: 'Deduct From*',
            feeLabel: 'Deduct Fee'
        }
    ]

    const getWalletTypes = (): WalletType[] => [
        { id: 'current', label: 'Current Account Wallet', balance: '12,556,245.98' },
        { id: 'credit', label: 'Credit Limit Wallet' },
        { id: 'reward', label: 'Reward Wallet' }
    ]


    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, we would validate the form here
        setStep('confirmation')
    }

    const handleTransfer = () => {
        // In a real app, we would make an API call here
        setShowSuccess(true)
    }

    const handleSuccessClose = () => {
        setShowSuccess(false)
        setStep('form')
        setFormData({
            transferType: 'credit',
            recipient: {
                email: '',
                name: '',
                userId: '',
                walletAddress: ''
            },
            walletType: 'current',
            amount: '',
            transferFee: '0.00',
            totalAmount: '0.00',
            description: '',
            note: ''
        })
    }

    const currentTransferType = getTransferTypes().find(type => type.id === formData.transferType)
    const currentWallet = getWalletTypes().find(type => type.id === formData.walletType)

    return (

        <DefaultLayout>
            <Breadcrumb pageName="Transfer" />

            <Card className="p-6">
                {step === 'form' ? (
                    <TransferForm
                        formData={formData}
                        onFormDataChange={setFormData}
                        onSubmit={handleFormSubmit}
                        getTransferTypes={getTransferTypes}
                        getWalletTypes={getWalletTypes}
                        descriptions={transferDescriptionsData}
                        availableBalance={currentWallet?.balance || '0.00'}
                        currentTransferType={currentTransferType}
                    />
                ) : (
                    <TransferConfirmation
                        data={formData}
                        onBack={() => setStep('form')}
                        onTransfer={handleTransfer}
                        currentTransferType={currentTransferType}
                    />
                )}
            </Card>

            {showSuccess && (
                <TransferSuccessModal onClose={handleSuccessClose} />
            )}

        </DefaultLayout>

    )
}

