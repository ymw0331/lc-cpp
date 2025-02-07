'use client'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import IncentiveCard from '@/components/Cards/IncentiveCard'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import DataTable from '@/components/Tables/DataTable'
import { StarBadgeIcon } from '@/components/Icons/dashboard'
import { incentivePageData, IncentivePageData } from '@/lib/data'
import React, { useState } from 'react'

const IncentiveManagementPage = () => {
    const [data] = useState<IncentivePageData>(incentivePageData);
    const [currentMonth, setCurrentMonth] = useState<string>(
        new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' })
    );

    // Table columns configuration
    const tableColumns = [
        { key: 'type', header: 'TYPE OF INCENTIVE', align: 'left' as const },
        { key: 'amount', header: 'AMOUNT', align: 'right' as const },
        { key: 'datetime', header: 'DATE TIME', align: 'right' as const },
    ];


    return (
        <DefaultLayout>
            <Breadcrumb pageName="Incentive Management" />

            <div className="grid gap-4 md:gap-6 2xl:gap-7.5">
                {/* Top Row */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 2xl:gap-7.5">
                    <div className="col-span-3">
                        <IncentiveCard
                            title="Total Incentive"
                            amount={data.summary.total_incentive}
                            icon={<StarBadgeIcon />}
                            className="bg-primary text-white h-full"
                        />
                    </div>
                    <div className="col-span-3">
                        <IncentiveCard
                            title="Milestone Bonus"
                            amount={data.summary.milestone_bonus.amount}
                            badge={{
                                text: 'Claimed',
                                type: 'claimed'
                            }}
                            className="h-full"
                        />
                    </div>
                </div>

                {/* Middle Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 2xl:gap-7.5">
                    <IncentiveCard
                        title="Direct Recruit's Referral Overriding Incentive"
                        amount={data.summary.direct_recruit_referral}
                    />
                    <IncentiveCard
                        title="Direct Admin Charge Rebate"
                        amount={data.summary.direct_admin_charge}
                    />
                    <IncentiveCard
                        title="Direct Recruit's Deposit Admin Charge Overriding Rebate"
                        amount={data.summary.direct_recruit_deposit}
                    />
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 2xl:gap-7.5">
                    <div className="md:col-span-2">
                        <IncentiveCard
                            title="Direct Recruit Level Advancement Bonus"
                            amount={data.summary.direct_recruit_level}
                            className="h-full"
                        />
                    </div>

                    <div className="md:col-span-4">
                        <IncentiveCard
                            title="Performance Bonus"
                            amount={data.summary.performance_bonus.amount}
                            className="h-full"
                            badge={{
                                text: 'Fulfilled',
                                type: 'fulfilled'
                            }}
                            activeUsers={data.summary.performance_bonus.activeUsers}
                        />
                    </div>
                </div>

                {/* Activity Table */}
                <div className="grid gap-4 md:gap-6 2xl:gap-7.5">
                    <DataTable
                        columns={tableColumns}
                        data={data.activities[currentMonth] || []}
                        title="Incentive Activity"
                        currentMonth={currentMonth}
                        onMonthChange={(month: string) => setCurrentMonth(month)}
                    />
                </div>
            </div>
        </DefaultLayout>
    )
}

export default IncentiveManagementPage