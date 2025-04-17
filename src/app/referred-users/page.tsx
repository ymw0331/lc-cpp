"use client"
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import RecruitCard from '@/components/Cards/RecruitCard';
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import RecruitmentSummaryChart from '@/components/Charts/RecruitmentSummaryChart';
import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import { fetchData } from '@/lib/api-utils';
import { recruitApi } from '@/api/referral/referral.api';
import { ReferredUsersSkeleton } from '@/components/common/Skeletons';
import MilestoneAchievementCard from '@/components/Cards/MilestoneAchievementCard';
import ReferralSummaryCard from '@/components/Cards/ReferralSummaryCard';
import AgentRecruitmentSummaryCard from '@/components/Cards/AgentRecruitmentSummaryCard';
import { useAuth } from '@/contexts/AuthContext';
import { checkTierPermission, TIER_PERMISSIONS } from '@/utils/permissions';
import RecruitAgentCard from '@/components/Cards/RecruitAgentCard';
import { incentiveApi } from '@/api/incentive/incentive.api';
import ErrorDisplay from '@/components/common/ErrorDisplay';


// Config flag - set to true for demo mode, false for real API integration
const DEMO_MODE = false;
// const DEMO_MODE = true;

const ReferredUsersPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    const [recruitData, setRecruitData] = useState<any>(null);
    const [incentiveData, setIncentiveData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // For demo purposes - select which month to show as completed
    // Can be 3, 4, 6 or null for no mock
    const [mockSuccessMonth, setMockSuccessMonth] = useState<3 | 4 | 6 | null>(6);

    const [selectedPeriod1, setSelectedPeriod1] = useState("Month");
    const [selectedPeriod2, setSelectedPeriod2] = useState("Month");

    useEffect(() => {
        // Fetch both recruit and incentive data
        const fetchAllData = async () => {
            setLoading(true);
            try {
                if (DEMO_MODE) {
                    // Mock data for demo mode
                    const mockRecruitData = {
                        recruitmentSummary: {
                            noOfDirectReferrals: 42,
                            totalDepositFromDirectReferrals: 5280
                        },
                        agentRecruitmentSummary: {
                            directRecruitVolume: 15,
                            depositVolume: 3750
                        },
                        chartData: {
                            Month: {},
                            Quarter: {},
                            Year: {}
                        }
                    };

                    const mockIncentiveData = {
                        summary: {
                            milestoneAchievement: {
                                activatedUsers: 82,
                                targetUsers: 80,
                                milestones: [
                                    {
                                        months: 3,
                                        reward: 500
                                    },
                                    {
                                        months: 4,
                                        reward: 400
                                    },
                                    {
                                        months: 6,
                                        reward: 300
                                    }
                                ]
                            }
                        }
                    };

                    setRecruitData(mockRecruitData);
                    setIncentiveData(mockIncentiveData);
                } else {
                    // Real API integration
                    const [recruitResponse, incentiveResponse] = await Promise.all([
                        recruitApi.getRecruitData(),
                        incentiveApi.getIncentiveData()
                    ]);

                    setRecruitData(recruitResponse);
                    setIncentiveData(incentiveResponse);
                }
                setError(null);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading || !user) {
        return <DefaultLayout><ReferredUsersSkeleton /></DefaultLayout>;
    }

    if (error || !recruitData || !incentiveData) {
        return <ErrorDisplay errorMessage={error?.message} />;
    }

    // Check user tier permissions
    const isLevel1 = user.tierPriority === TIER_PERMISSIONS.LEVEL_1_TIER;

    const canAccessRecruitment = checkTierPermission(
        user.tierPriority,
        TIER_PERMISSIONS.LEVEL_2_TIER
    );

    // Prepare milestone data from incentive API
    const milestoneData = incentiveData?.summary?.milestoneAchievement || null;

    // Convert milestone data to match component props
    const prepareMilestoneData = () => {
        if (!milestoneData) return null;

        return {
            // activatedUsers: milestoneData.activatedUsers || 82,
            activatedUsers: milestoneData.activatedUsers,
            targetUsers: milestoneData.targetUsers || 80,
            milestones: milestoneData.milestones.map((m: any) => ({
                months: m.months,
                reward: m.reward,
                // In real app, calculate completed based on completeAt date
                // For demo mode, we use mockSuccessMonth for visualization
                isCompleted: !DEMO_MODE ? !!m.completeAt : undefined
            }))
        };
    };

    const milestoneAchievementData = prepareMilestoneData();

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("referredUsersPage.referredUsersBreadcrumb")} />

            {/* Demo Mode Indicator */}
            {DEMO_MODE && (
                <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-800 p-2 rounded-lg text-sm flex items-center justify-between">
                    <span className="font-medium">Demo Mode: Using mock data instead of API integration</span>
                    {isLevel1 && (
                        <div className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
                            To use real API, set <code className="bg-gray-100 px-1 rounded">DEMO_MODE = false</code> at the top of page.tsx
                        </div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <ReferralSummaryCard
                    directReferralsCount={recruitData.recruitmentSummary?.noOfDirectReferrals || 0}
                    totalDepositFromDirectReferrals={recruitData.recruitmentSummary?.totalDepositFromDirectReferrals || 0}
                    selectedPeriod={selectedPeriod1}
                    onPeriodChange={setSelectedPeriod1}
                    periodOptions={Object.keys(recruitData.chartData || {})}
                />

                <AgentRecruitmentSummaryCard
                    directRecruitVolume={recruitData.agentRecruitmentSummary?.directRecruitVolume || 0}
                    depositVolume={recruitData.agentRecruitmentSummary?.depositVolume || 0}
                    selectedPeriod={selectedPeriod2}
                    onPeriodChange={setSelectedPeriod2}
                    periodOptions={Object.keys(recruitData.chartData || {})}
                />
            </div>

            {/* Only show RecruitAgentCard for Level 2 and above */}
            {canAccessRecruitment && (
                <div className="mb-6">
                    <RecruitAgentCard />
                </div>
            )}

            <div className="grid gap-4 md:gap-6 2xl:gap-7.5">
                {/* Mock selection for demo purposes */}
                {isLevel1 && DEMO_MODE && (
                    <div className="flex flex-wrap gap-2 mb-4 p-4 bg-white dark:bg-boxdark rounded-xl shadow-sm">
                        <div className="font-medium">Demo: Choose success month</div>
                        <button
                            className={`px-3 py-1 rounded ${mockSuccessMonth === 3 ? 'bg-primary text-white' : 'bg-gray-100'}`}
                            onClick={() => setMockSuccessMonth(3)}
                        >
                            3 Months
                        </button>
                        <button
                            className={`px-3 py-1 rounded ${mockSuccessMonth === 4 ? 'bg-primary text-white' : 'bg-gray-100'}`}
                            onClick={() => setMockSuccessMonth(4)}
                        >
                            4 Months
                        </button>
                        <button
                            className={`px-3 py-1 rounded ${mockSuccessMonth === 6 ? 'bg-primary text-white' : 'bg-gray-100'}`}
                            onClick={() => setMockSuccessMonth(6)}
                        >
                            6 Months
                        </button>
                        <button
                            className={`px-3 py-1 rounded ${mockSuccessMonth === null ? 'bg-primary text-white' : 'bg-gray-100'}`}
                            onClick={() => setMockSuccessMonth(null)}
                        >
                            No Success
                        </button>
                    </div>
                )}

                {/* Only Level 1 agents see Milestone Achievement Card */}
                {isLevel1 && milestoneAchievementData && (
                    <div className="mb-6">
                        <MilestoneAchievementCard
                            activatedUsers={milestoneAchievementData.activatedUsers}
                            targetUsers={milestoneAchievementData.targetUsers}
                            milestones={milestoneAchievementData.milestones}
                            mockSuccessMonth={DEMO_MODE ? mockSuccessMonth : null}
                        />
                    </div>
                )}

                {canAccessRecruitment && (
                    <div className="mb-6">
                        <RecruitmentSummaryChart
                            title={t("referredUsersPage.recruitmentSummary")}
                            lineColor="#F69732"
                        />
                    </div>
                )}
            </div>
        </DefaultLayout>
    )
}

export default ReferredUsersPage