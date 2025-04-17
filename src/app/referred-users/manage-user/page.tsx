"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AgentLevelCard from "@/components/Cards/AgentLevelCard";
import AgentLevelIcon from "@/components/Icons/dashboard/AgentLevelIcon";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UsersTable from "@/components/Tables/UsersTable";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { resellerApi } from "@/api/reseller/reseller.api";
import { ManageUserSkeleton } from "@/components/common/Skeletons";
import { useAuth } from "@/contexts/AuthContext";
import { ResellerResponse, Downstream, DirectReferral, TierCounts, TierLevel } from "@/api/reseller/reseller.types";
import ErrorDisplay from "@/components/common/ErrorDisplay";
import { useSearchParams } from "next/navigation";

type TabType = "agents" | "referred-users";

const ManageUserPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [resellerData, setResellerData] = useState<ResellerResponse | null>(null);
    const [downstreamCounts, setDownstreamCounts] = useState<TierCounts>({
        'tier 0': 0,
        'tier 1': 0,
        'tier 2': 0,
        'tier 3': 0,
        'tier 4': 0,
        'tier 5': 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [visibleDownstreams, setVisibleDownstreams] = useState<Downstream[]>([]);


    // New state for managing table filters and active tab
    const [activeTab, setActiveTab] = useState<TabType>("referred-users");
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const searchParams = useSearchParams();

    // Handle tab from URL
    useEffect(() => {
        if (searchParams.has("tab")) {
            const tab = searchParams.get("tab");
            if (tab === "agents") {
                setActiveTab("agents");
            } else {
                setActiveTab("referred-users");
            }
        }
    }, [searchParams]);

    // Create a refreshData function to reuse
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const resellerResponse = await resellerApi.getCurrentReseller();
            setResellerData(resellerResponse);

            // Count downstream users using resellerApi utility
            const counts = resellerApi.countDownstreamByTier(resellerResponse.downstreams);

            // Update tier 0 count with directReferrals length from reseller response
            counts['tier 0'] = resellerResponse.directReferral?.length || 0;

            setDownstreamCounts(counts);

            // Get current tier priority
            const currentTierPriority = resellerResponse?.tier?.priority || user?.tierPriority || 0;

            // Filter visible downstreams based on tier priority rules
            let filteredDownstreams: Downstream[] = [];

            if (resellerResponse.downstreams && resellerResponse.downstreams.length > 0) {
                // Get accessible tiers for filtering
                const accessibleTiers = resellerApi.getAccessibleTierLevels(currentTierPriority);
                
                // Filter downstreams based on accessible tiers
                filteredDownstreams = resellerResponse.downstreams.filter(downstream => {
                    const downstreamTier = `tier ${downstream.tier?.priority || 0}` as TierLevel;
                    return accessibleTiers.includes(downstreamTier);
                });
            }

            setVisibleDownstreams(filteredDownstreams);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err instanceof Error ? err : new Error(t('manageUserPage.failedToFetchData')));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [t, user]);

    if (loading) {
        return (
            <DefaultLayout>
                <ManageUserSkeleton />
            </DefaultLayout>
        );
    }

    if (error || !resellerData) {
        return (
            <DefaultLayout>
                <ErrorDisplay
                    errorMessage={error?.message}
                    onRetry={fetchData}
                />
            </DefaultLayout>
        );
    }

    // Get current tier priority and accessible tiers
    const currentTierPriority = resellerData?.tier?.priority || user?.tierPriority || 0;
    const accessibleTiers = resellerApi.getAccessibleTierLevels(currentTierPriority);

    // Function to get the display name for a tier
    const getTierDisplayName = (tier: TierLevel): string => {
        const priority = parseInt(tier.split(' ')[1]);
        if (tier === 'tier 0') {
            return t('manageUserPage.tier0', 'Users');
        }
        return t(`manageUserPage.tier${priority}`, resellerApi.getTierNameByPriority(priority));
    };

    // Function to handle card clicks
    const handleCardClick = (tierLevel: string, tabId: string) => {
        setActiveTab(tabId as TabType);
        setActiveFilter(tierLevel === 'tier 0' ? null : tierLevel);
    };

    // Create agent level cards based on accessible tiers
    const agentLevelCards = accessibleTiers.map((tier) => {
        const count = downstreamCounts[tier] || 0;
        const displayName = getTierDisplayName(tier);

        // Only tier 0, tier 1, and tier 2 are clickable
        const isClickable = ['tier 0', 'tier 1', 'tier 2'].includes(tier);

        return (
            <AgentLevelCard
                key={tier}
                level={displayName}
                count={count}
                icon={<AgentLevelIcon />}
                tierLevel={tier}
                isClickable={isClickable}
                onCardClick={handleCardClick}
            />
        );
    });

    // Use the actual direct referrals from the API response
    const directReferrals = resellerData.directReferral || [];

    // Apply filters to downstreams if needed
    const filteredDownstreams = activeFilter
        ? visibleDownstreams.filter(d => d.tierId === activeFilter)
        : visibleDownstreams;

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-4 sm:gap-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                    <Breadcrumb pageName={t("manageUserPage.manageUsersBreadcrumb", "Manage Users")} />
                </div>

                {/* Main Content */}
                <div className="grid gap-4 sm:gap-6">
                    {/* Agent Level Cards */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {agentLevelCards}
                    </div>

                    {/* Users Table */}
                    <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark overflow-hidden">
                        <UsersTable
                            downstreams={filteredDownstreams}
                            directReferrals={directReferrals}
                            dashboardTotalReferrals={directReferrals.length}
                            userTierPriority={currentTierPriority}
                            initialActiveTab={activeTab}
                        />
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default ManageUserPage;