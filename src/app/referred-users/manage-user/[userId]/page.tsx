'use client'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import MetricsChart from '@/components/Charts/MetricsChart';
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import { UserProfileView } from '@/components/user-profiles/UserProfileView';
import React from 'react'

const SingleUserPage = () => {

    const chartData = {
        cardActivation: {
            "2023": {
                Year: [
                    { label: 'Jan', value: 150 },
                    { label: 'Feb', value: 450 },
                    { label: 'Mar', value: 380 },
                    { label: 'Apr', value: 560 },
                    { label: 'May', value: 270 },
                    { label: 'Jun', value: 490 },
                    { label: 'Jul', value: 120 },
                    { label: 'Aug', value: 590 },
                    { label: 'Sep', value: 310 },
                    { label: 'Oct', value: 430 },
                    { label: 'Nov', value: 580 },
                    { label: 'Dec', value: 530 }
                ],
                Month: [
                    { label: 'Week 1', value: 320 },
                    { label: 'Week 2', value: 480 },
                    { label: 'Week 3', value: 290 },
                    { label: 'Week 4', value: 510 }
                ],
                Week: [
                    { label: 'Mon', value: 85 },
                    { label: 'Tue', value: 120 },
                    { label: 'Wed', value: 95 },
                    { label: 'Thu', value: 140 },
                    { label: 'Fri', value: 110 },
                    { label: 'Sun', value: 65 }
                ]
            },
            "2022": {
                Year: [
                    { label: 'Jan', value: 120 },
                    { label: 'Feb', value: 380 },
                    { label: 'Mar', value: 320 },
                    { label: 'Apr', value: 480 },
                    { label: 'May', value: 230 },
                    { label: 'Jun', value: 420 },
                    { label: 'Jul', value: 90 },
                    { label: 'Aug', value: 510 },
                    { label: 'Sep', value: 280 },
                    { label: 'Oct', value: 390 },
                    { label: 'Nov', value: 520 },
                    { label: 'Dec', value: 480 }
                ],
                Month: [
                    { label: 'Week 1', value: 280 },
                    { label: 'Week 2', value: 420 },
                    { label: 'Week 3', value: 250 },
                    { label: 'Week 4', value: 460 }
                ],
                Week: [
                    { label: 'Mon', value: 75 },
                    { label: 'Tue', value: 110 },
                    { label: 'Wed', value: 85 },
                    { label: 'Thu', value: 130 },
                    { label: 'Fri', value: 100 },
                    { label: 'Sat', value: 65 },
                    { label: 'Sun', value: 55 }
                ]
            }
        },
    };

    const userData = {
        name: "Adam Lam",
        avatar: "/path-to-avatar.png",
        level: "Level 2 Agent",
        promotedDate: "Nov 07, 2024",
        userId: "10118237",
        joinedSince: "Nov 07, 2024",
        lastActive: "Nov 07, 2024 18:37:32",
        keyMarket: "Malaysia",
        stats: {
            directRecruit: 2,
            directReferrals: 148,
            cardActivation: {
                current: 340,
                total: 1000,
                percentage: 34
            },
            agentRecruitment: {
                current: 2,
                total: 5,
                percentage: 40
            }
        },
        status: {
            deposit: true,
            eKYC: true,
            activatedCard: true,
            physicalCard: true
        }
    };


    return (
        <DefaultLayout>
            <Breadcrumb pageName='Manage Users' />

            <UserProfileView user={userData} />


            <div className="col-span-1 mt-6">
                <MetricsChart
                    title="Card Activation Volume"
                    amount={6340}
                    data={chartData.cardActivation}
                    barColor="rgb(59, 130, 246)"
                    valueFormatter={(value) => value.toLocaleString()}
                />
            </div>

        </DefaultLayout>

    )
}

export default SingleUserPage
