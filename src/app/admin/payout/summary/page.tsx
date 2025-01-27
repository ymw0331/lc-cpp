'use client'

import { useState } from 'react'
import { PayoutTable } from '@/components/Tables/PayoutTable'
import { type PayoutRecord, type PayoutStatus } from '@/types/payout'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import DefaultLayout from "@/components/Layouts/DefaultLayout"

// Generate more sample data
const generateSampleData = (count: number): PayoutRecord[] => {
    const baseData = [
        {
            id: '1',
            userId: 'LOOK_00365',
            name: 'LIM AH HUAT',
            email: 'ahlock.look',
            rank: 'Level 3',
            description: 'Card Referral Incentive',
            date: '2024-11-13',
            transactionId: 'INCP_01284',
            amount: 24562.56,
            status: 'Await' as PayoutStatus
        },
        {
            id: '2',
            userId: 'LOOK_00365',
            name: 'PETER SAM',
            email: 'honghuat@look',
            rank: 'Level 2',
            description: 'Direct Recruits Referral Override Incentive',
            date: '2024-11-13',
            transactionId: 'INCP_01284',
            amount: 1000.00,
            status: 'Await' as PayoutStatus
        },
        {
            id: '3',
            userId: 'LOOK_00365',
            name: 'PETER SAM',
            email: 'peter@sam.look',
            rank: 'Level 2',
            description: 'Deposit Admin Charge Rebate',
            date: '2024-11-13',
            transactionId: 'INCP_01284',
            amount: 12212.10,
            status: 'Decline' as PayoutStatus
        },
        {
            id: '4',
            userId: 'LOOK_00365',
            name: 'SABRIBA LAU',
            email: 'sabribalau.look',
            rank: 'Level 2',
            description: "Direct Recruit's Deposit Override Rebate",
            date: '2024-11-13',
            transactionId: 'INCP_01284',
            amount: 2381.21,
            status: 'Pending' as PayoutStatus
        },
        {
            id: '5',
            userId: 'LOOK_00365',
            name: 'JESSIE THOO',
            email: 'jessie2.look',
            rank: 'Level 2',
            description: 'Deposit Admin Charge Rebate',
            date: '2024-11-13',
            transactionId: 'INCP_01284',
            amount: 2381.21,
            status: 'Approved' as PayoutStatus
        }
    ]

    const result: PayoutRecord[] = [...baseData]

    for (let i = baseData.length; i < count; i++) {
        result.push({
            id: `${i + 1}`,
            userId: `LOOK_${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`,
            name: ['LIM AH HUAT', 'PETER SAM', 'SABRIBA LAU', 'JESSIE THOO'][Math.floor(Math.random() * 4)],
            email: 'user@example.com',
            rank: `Level ${Math.floor(Math.random() * 3) + 1}`,
            description: [
                'Card Referral Incentive',
                'Direct Recruits Referral Override Incentive',
                'Deposit Admin Charge Rebate',
                "Direct Recruit's Deposit Override Rebate"
            ][Math.floor(Math.random() * 4)],
            date: '2024-11-13',
            transactionId: `INCP_${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`,
            amount: Math.random() * 50000,
            status: ['Await', 'Approved', 'Pending', 'Decline'][Math.floor(Math.random() * 4)] as PayoutStatus
        })
    }

    return result
}

// Generate 58 sample records
const tableData = generateSampleData(58)

const PayoutSummaryPage = () => {

    const [data, setData] = useState<PayoutRecord[]>(tableData)

    const handleStatusChange = (id: string, status: PayoutStatus) => {
        setData(currentData =>
            currentData.map(record =>
                record.id === id ? { ...record, status } : record
            )
        )
    }

    const handleDownload = () => {
        // In a real app, this would trigger a file download
        console.log('Downloading data...')
    }


    return (
        <DefaultLayout>
            <Breadcrumb pageName="Payout Summary" />

            <PayoutTable
                data={data}
                onStatusChange={handleStatusChange}
                onDownload={handleDownload}
            />

        </DefaultLayout>
    )
}

export default PayoutSummaryPage