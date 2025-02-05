'use client'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import AgentLevelCard from '@/components/Cards/AgentLevelCard';
import CircularProgressCard from '@/components/Cards/CircularProgressCard';
import ProfileHeaderCard from '@/components/Cards/ProfileHeaderCard';
import ActivationVolumeChart from '@/components/Charts/ActivationVolumeChart';
import MetricsChart from '@/components/Charts/MetricsChart';
import AgentLevelIcon from '@/components/Icons/dashboard/AgentLevelIcon';
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const SingleUserPage = () => {

    const userData = {
        name: "Adam Lam",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adam",
        level: "Level 2 Agent",
        promotedDate: "Nov 07, 2024",
        // Properly structured details object
        details: {
            userId: "10118237",
            joinedSince: "Nov 07, 2024",
            lastActive: "Nov 07, 2024 18:37:32",
            keyMarket: "Malaysia"
        },
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
        },
        // Optional social links
        socialLinks: {
            facebook: "https://facebook.com",
            linkedin: "https://linkedin.com"
        }

    };

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

    return (
        <DefaultLayout>
            <Breadcrumb pageName='Manage Users' />

            <div className="bg-whiten dark:bg-boxdark-2">

                <Link href="/referred-users/manage-user">
                    <button className="group flex items-center gap-2 mb-6 text-body dark:text-bodydark2 hover:text-black dark:hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Back
                    </button>
                </Link>


                <div className="grid lg:grid-cols-12 gap-6">
                    {/* Left Column - Profile Cards */}
                    <div className="lg:col-span-7">
                        <ProfileHeaderCard data={userData} />
                    </div>

                    {/* Right Column - Stats */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <AgentLevelCard
                                level="Total Direct Recruit"
                                count={userData.stats.directRecruit}
                                icon={<AgentLevelIcon />}
                            />
                            <AgentLevelCard
                                level="Total Direct Referrals"
                                count={userData.stats.directReferrals}
                                icon={<AgentLevelIcon />}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <CircularProgressCard
                                title="Card Activation Volume"
                                current={userData.stats.cardActivation.current}
                                total={userData.stats.cardActivation.total}
                                label="Active Users"
                            />
                            <CircularProgressCard
                                title="Total Agent Recruitment"
                                current={userData.stats.agentRecruitment.current}
                                total={userData.stats.agentRecruitment.total}
                                label="Agents"
                            />
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="lg:col-span-12">
                        {/* <MetricsChart
                            title="Card Activation Volume"
                            amount={userData.stats.cardActivation.current}
                            data={chartData.cardActivation}
                            barColor="rgb(59, 130, 246)"
                            valueFormatter={(value) => value.toLocaleString()}
                        /> */}

                        <ActivationVolumeChart/>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default SingleUserPage