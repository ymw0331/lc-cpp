"use client"
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import RecruitCard from '@/components/Cards/RecruitCard';
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import AnalyticChart from '@/components/Charts/AnalyticChart';
import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import { fetchData } from '@/lib/api-utils';
import { recruitApi } from '@/api/referral/referral.api';
import Loader from '@/components/common/Loader';
import MilestoneAchievementCard from '@/components/Cards/MilestoneAchievementCard';
import RecruitmentSummaryCard from '@/components/Cards/RecruitmentSummaryCard';
import AgentRecruitmentSummaryCard from '@/components/Cards/AgentRecruitmentSummaryCard';
import { useAuth } from '@/contexts/AuthContext';
import { checkTierPermission, TIER_PERMISSIONS } from '@/utils/permissions';

const ReferredUsersPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    const [recruitData, setRecruitData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const [selectedPeriod1, setSelectedPeriod1] = useState("Month");
    const [selectedPeriod2, setSelectedPeriod2] = useState("Month");

    useEffect(() => {
        fetchData(
            recruitApi.getRecruitData,
            setRecruitData,
            setError,
            setLoading
        );
    }, []);

    if (loading || !user) return <Loader />;

    if (error || !recruitData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">{t('referredUsersPage.failedToLoadData')}</p>
            </div>
        );
    }

    // Check user tier permissions
    const isLevel1 = user.tierPriority === TIER_PERMISSIONS.LEVEL_1_TIER;
    const canAccessRecruitment = checkTierPermission(
        user.tierPriority,
        TIER_PERMISSIONS.LEVEL_2_TIER
    );


    // Get the correct chart data based on the selected period
    const chartData = recruitData.chartData?.[selectedPeriod1] || [];

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("referredUsersPage.referredUsersBreadcrumb")} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <RecruitmentSummaryCard
                    directReferralsCount={recruitData.recruitmentSummary?.directReferralsCount || 0}
                    depositVolume={recruitData.recruitmentSummary?.depositVolume || 0}
                    selectedPeriod={selectedPeriod1}
                    onPeriodChange={setSelectedPeriod1}
                    periodOptions={Object.keys(recruitData.chartData || {})}
                />

                <AgentRecruitmentSummaryCard
                    directRecruitVolume={recruitData.agentRecruitmentSummary?.directRecruitVolume}
                    depositVolume={recruitData.agentRecruitmentSummary?.depositVolume}
                    selectedPeriod={selectedPeriod2}
                    onPeriodChange={setSelectedPeriod2}
                    periodOptions={Object.keys(recruitData.chartData || {})}
                />
            </div>

            <div className="grid gap-4 md:gap-6 2xl:gap-7.5">
                {/* Only Level 2+ agents see Total Direct Recruit */}
                {/* {!isLevel1 && canAccessRecruitment && (
                    <div className="w-full md:w-2/4">
                        <RecruitCard
                            count={recruitData.count || 0}
                            agentsToPartner={{
                                count: recruitData.agentsToPartner?.count || 0,
                                trend: recruitData.agentsToPartner?.trend || 'up'
                            }}
                        />
                    </div>
                )} */}

                {/* Only Level 1 agents see Milestone Achievement Card */}
                {isLevel1 && recruitData.milestoneAchievement && (
                    <MilestoneAchievementCard
                        activatedUsers={recruitData.milestoneAchievement.activatedUsers}
                        targetUsers={recruitData.milestoneAchievement.targetUsers}
                        milestones={recruitData.milestoneAchievement.milestones}
                    />
                )}

                {/* Chart customized based on level */}
                {/* <AnalyticChart
                    title={t("referredUsersPage.recruitmentSummary")}
                    chartData={recruitData.chartData}
                    showLegend={true}
                    legendLabel={t("referredUsersPage.totalDirectRecruit")}
                    legendPosition="top-right"
                    lineColor="#F69732"
                    comingSoon={true} 
                /> */}
            </div>
        </DefaultLayout>
    )
}

export default ReferredUsersPage