"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AgentLevelCard from "@/components/Cards/AgentLevelCard";
import Loader from "@/components/common/Loader";
import AgentLevelIcon from "@/components/Icons/dashboard/AgentLevelIcon";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UsersTable from "@/components/Tables/UsersTable";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { resellerApi } from "@/api/reseller/reseller.api";
import { dashboardApi } from "@/api/dashboard/dashboard.api";

const ManageUserPage = () => {
    const { t } = useTranslation();
    const [resellerData, setResellerData] = useState<any>(null);
    const [downstreamCounts, setDownstreamCounts] = useState<Record<string, number>>({});
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch reseller info
                const resellerResponse = await resellerApi.getResellerInfo();
                setResellerData(resellerResponse);

                // Fetch dashboard data
                const dashboardResponse = await dashboardApi.getDashboardData();
                setDashboardData(dashboardResponse);

                // Count downstream users
                const counts = resellerApi.countDownstreamByTier(resellerResponse.downstreams);

                // Update tier 0 count with totalReferral from dashboard
                counts['tier 0'] = dashboardResponse.totalReferral || 0;

                setDownstreamCounts(counts);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err instanceof Error ? err : new Error(t('manageUserPage.failedToFetchData')));
                setLoading(false);
            }
        };

        fetchData();
    }, [t]);

    if (loading) return <Loader />;

    if (error || !resellerData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">{t('manageUserPage.failedToLoadData')}</p>
                <p className="text-red-500">{error?.message}</p>
            </div>
        );
    }

    // Determine accessible tier levels based on current tier
    const currentTierPriority = resellerData?.tier?.priority || 0;
    const accessibleTiers = resellerApi.getAccessibleTierLevels(currentTierPriority);

    // Function to get the display name for a tier
    const getTierDisplayName = (tier: string) => {
        switch (tier) {
            case 'tier 0':
                return t('manageUserPage.tier0', 'Users');
            case 'tier 1':
                return t('manageUserPage.tier1', 'Level 1 Agents');
            case 'tier 2':
                return t('manageUserPage.tier2', 'Level 2 Agents');
            case 'tier 3':
                return t('manageUserPage.tier3', 'Level 3 Partners');
            case 'tier 4':
                return t('manageUserPage.tier4', 'Level 4 Partners');
            case 'tier 5':
                return t('manageUserPage.tier5', 'Level 5 Partners');
            default:
                return t('manageUserPage.unknownTier', { tier });
        }
    };

    // Create agent level cards based on accessible tiers
    const agentLevelCards = accessibleTiers.map((tier) => {
        const count = downstreamCounts[tier] || 0;
        const displayName = getTierDisplayName(tier);

        return (
            <AgentLevelCard
                key={tier}
                level={displayName}
                count={count}
                icon={<AgentLevelIcon />}
            />
        );
    });

    // Placeholder for direct referrals, will be replaced with actual API data
    const directReferrals: any[] = [];

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("manageUserPage.manageUsersBreadcrumb", "Manage Users")} />

            <div className="grid gap-4 md:gap-6 2xl:gap-7.5">
                {/* Agent Level Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {agentLevelCards}
                </div>

                <div className="mt-3">
                    <UsersTable 
                        downstreams={resellerData.downstreams} 
                        directReferrals={directReferrals}
                        dashboardTotalReferrals={dashboardData?.totalReferral || 0}
                    />
                </div>
            </div>
        </DefaultLayout>
    );
}

export default ManageUserPage;
