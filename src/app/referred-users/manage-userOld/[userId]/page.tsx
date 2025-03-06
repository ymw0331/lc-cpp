'use client'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import AgentLevelCard from '@/components/Cards/AgentLevelCard';
import CircularProgressCard from '@/components/Cards/CircularProgressCard';
import ProfileHeaderCard from '@/components/Cards/ProfileHeaderCard';
import ActivationVolumeChart from '@/components/Charts/ActivationVolumeChart';
import AgentLevelIcon from '@/components/Icons/dashboard/AgentLevelIcon';
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { singleUserData } from '@/lib/data';
const SingleUserPage = () => {


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
            

                    {/* Right Column - Stats */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <AgentLevelCard
                                level="Direct Recruit Active Agent(s)"
                                count={singleUserData.stats.directRecruit}
                                icon={<AgentLevelIcon />}
                            />
                            <AgentLevelCard
                                level="Total Direct Referrals"
                                count={singleUserData.stats.directReferrals}
                                icon={<AgentLevelIcon />}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <CircularProgressCard
                                title="Card Activation Volume"
                                current={singleUserData.stats.cardActivation.current}
                                total={singleUserData.stats.cardActivation.total}
                                label="Active Users"
                            />
                            <CircularProgressCard
                                title="Total Agent Recruitment"
                                current={singleUserData.stats.agentRecruitment.current}
                                total={singleUserData.stats.agentRecruitment.total}
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

                        <ActivationVolumeChart />
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default SingleUserPage