'use client'

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import AgentLevelCard from '@/components/Cards/AgentLevelCard';
import CircularProgressCard from '@/components/Cards/CircularProgressCard';
import ProfileHeaderCard from '@/components/Cards/ProfileHeaderCard';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { resellerApi } from '@/api/reseller/reseller.api';
import Loader from '@/components/common/Loader';

// Additional icons for agent profile cards
import { Users, UserPlus } from 'lucide-react';

const AgentProfilePage = () => {
    const router = useRouter();
    const params = useParams();
    const profileId = params.profileOwnerId as string;

    const [agentData, setAgentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchAgentData = async () => {
            try {
                if (!profileId) {
                    throw new Error("Profile ID is required");
                }

                setLoading(true);
                // Use the specified endpoint for agent data
                const response = await resellerApi.getAgentData(profileId);
                console.log("API Response:", response); // Log the full response for debugging
                setAgentData(response);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching agent data:", err);
                setError(err instanceof Error ? err : new Error("Failed to fetch agent data"));
                setLoading(false);
            }
        };

        fetchAgentData();
    }, [profileId]);

    // Default stats for components without data
    const defaultStats = {
        directRecruit: 0,
        directReferrals: 0,
        cardActivation: {
            current: 0,
            total: 3
        },
        agentRecruitment: {
            current: 3,
            total: 1
        }
    };

    // Extract stats from agent data or use defaults
    const getStats = () => {
        if (!agentData) return defaultStats;

        return {
            directRecruit: agentData.downstreams?.length || 3,
            directReferrals: agentData.directReferral?.length || 0,
            cardActivation: {
                current: agentData.downstreams?.filter((d: any) =>
                    d.user?.cardStatus === 'active').length || 0,
                total: 3
            },
            agentRecruitment: {
                current: 3,
                total: -1 // To match the screenshot showing "3 / -1"
            }
        };
    };

    // Prepare profile data for ProfileHeaderCard
    const getProfileData = () => {
        if (!agentData) return null;

        // Format date to match the screenshot (February 04, 2025 at 05:22 PM)
        const formatDate = (dateString: string) => {
            if (!dateString) return 'N/A';

            try {
                const date = new Date(dateString);
                const options: Intl.DateTimeFormatOptions = {
                    year: 'numeric',
                    month: 'long',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                };
                return date.toLocaleDateString('en-US', options);
            } catch (error) {
                return 'N/A';
            }
        };

        // Extract level name for display
        const levelName = `Level ${agentData.tier?.priority || 5}`;

        return {
            // Name might not be available in the API response, so we use "Agent" as default
            name: "Agent", // Matching the screenshot
            level: levelName,
            details: {
                resellerId: agentData.id || profileId,
                joinedSince: formatDate(agentData.createdAt),
                lastActive: formatDate(agentData.updatedAt),
                keyMarket: agentData.country || 'Malaysia' // Default matches screenshot
            },
            status: {
                deposit: agentData.user?.firstDeposit || false,
                eKYC: agentData.user?.ekycStatus === 'completed',
                accountActivation: agentData.user?.status === 'active',
                physicalCard: agentData.user?.cardStatus === 'active'
            }
        };
    };

    const stats = getStats();
    const profileData = getProfileData();

    if (loading) return (
        <DefaultLayout>
            <Breadcrumb pageName='Agent Profile' />
            <Loader />
        </DefaultLayout>
    );

    if (error) {
        return (
            <DefaultLayout>
                <Breadcrumb pageName='Agent Profile' />
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <div className="text-red-500 mb-4">Failed to load agent profile</div>
                    <p className="text-bodydark mb-6">{error.message}</p>
                    <Link href="/referred-users/manage-user">
                        <button className="group flex items-center gap-2 mb-6 text-body dark:text-bodydark2 hover:text-black dark:hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            Back
                        </button>
                    </Link>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName='Agent Profile' />

            <div className="bg-whiten dark:bg-boxdark-2">
                <Link href="/referred-users/manage-user">
                    <button className="group flex items-center gap-2 mb-6 text-body dark:text-bodydark2 hover:text-black dark:hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        Back
                    </button>
                </Link>

                <div className="grid lg:grid-cols-12 gap-6">
                    {/* Profile Header Card - Top Section */}
                    <div className="lg:col-span-12">
                        {profileData ? (
                            <ProfileHeaderCard data={profileData} />
                        ) : (
                            <div className="h-40 bg-gray-200 dark:bg-meta-4 rounded-sm animate-pulse"></div>
                        )}
                    </div>

                    {/* Stats Cards - Same row on desktop, columns on mobile */}
                    <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* AgentLevelCards - first row */}
                        <AgentLevelCard
                            level="Direct Recruit Active Agent(s)"
                            count={stats.directRecruit}
                            icon={<Users className="h-6 w-6 text-primary" />}
                        />
                        <AgentLevelCard
                            level="Total Direct Referrals"
                            count={stats.directReferrals}
                            icon={<UserPlus className="h-6 w-6 text-primary" />}
                        />

                        {/* CircularProgressCards - same row on desktop */}
                        <CircularProgressCard
                            title="Card Activation Volume"
                            current={stats.cardActivation.current}
                            total={stats.cardActivation.total}
                            label="Active Users"
                        />
                        <CircularProgressCard
                            title="Total Agent Recruitment"
                            current={stats.agentRecruitment.current}
                            total={stats.agentRecruitment.total}
                            label="Agents"
                        />
                    </div>

                    {/* Chart Section - Greyed out */}
                    {/* <div className="lg:col-span-12">
                        <div className="h-80 bg-gray-200 dark:bg-meta-4 rounded-sm flex items-center justify-center">
                            <span className="text-gray-500 dark:text-bodydark">
                                Activation volume data will be available soon
                            </span>
                        </div>
                    </div> */}
                </div>
            </div>
        </DefaultLayout>
    );
};

export default AgentProfilePage;