"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import IncentiveCard from "@/components/Cards/IncentiveCard";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DataTable from "@/components/Tables/DataTable";
import { StarBadgeIcon } from "@/components/Icons/dashboard";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchData } from '@/lib/api-utils';
import { incentiveApi, IncentiveResponse } from "@/api/incentive/incentive.api";
import Loader from "@/components/common/Loader";
import { checkTierPermission, TIER_PERMISSIONS } from "@/utils/permissions";
import { useAuth } from "@/contexts/AuthContext";



const IncentiveManagementPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [currentMonth, setCurrentMonth] = useState<string>(
        new Date().toLocaleString("en-US", { month: "short", year: "numeric" })
    );

    const [incentiveData, setIncentiveData] = useState<IncentiveResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetchData(
            incentiveApi.getIncentiveData,
            setIncentiveData,
            setError,
            setLoading
        );

    }, []);

    const tableColumns = [
        { key: "type", header: t("dataTable.transactionId"), align: "left" as const },
        { key: "amount", header: t("dataTable.transferredAmount"), align: "right" as const },
        { key: "datetime", header: t("dataTable.dateTime"), align: "right" as const },
    ];

    if (loading)
        return <Loader />;

    if (error || !incentiveData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">{t('incentiveManagementPage.failedToLoadData')}</p>
            </div>
        );
    }

    // Check if user is a Level 1 agent
    const isLevelOneAgent = user?.tierPriority === TIER_PERMISSIONS.LEVEL_1_TIER;

    // Check if user can see incentives (Level 2 and above)
    const canSeeIncentives = checkTierPermission(
        user?.tierPriority || 0,
        TIER_PERMISSIONS.LEVEL_2_TIER
    );

    const { summary, activities } = incentiveData;

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("incentiveManagementPage.incentiveManagementBreadcrumb")} />

            <div className="grid gap-4 md:gap-6 2xl:gap-7.5">
                {/* Top Row */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 2xl:gap-7.5">
                    <div className="col-span-3">
                        <IncentiveCard
                            title={t("incentiveManagementPage.totalIncentive")}
                            amount={summary.total_incentive}
                            icon={<StarBadgeIcon />}
                            className="bg-primary text-white h-full"
                        />
                    </div>

                    <div className="col-span-3">
                        {isLevelOneAgent ? (
                            // Show Milestone Bonus for Level 1 agents only
                            <IncentiveCard
                                title={t("incentiveManagementPage.milestoneAchievementBonus")}
                                amount={summary.milestone_bonus.amount}
                                className="h-full"
                            />
                        ) : (
                            // Show Referral Bonus for other agents
                            <IncentiveCard
                                title={t('incentiveManagementPage.referralFeeBonus')}
                                amount={summary.directReferralFee}
                                className="h-full"
                            />
                        )}
                    </div>
                </div>

                {/* Middle Row - Only visible for level 2 and above */}
                {canSeeIncentives && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 2xl:gap-7.5">
                        <IncentiveCard
                            title={t("incentiveManagementPage.directRecruitReferralFeeOverrideBonus")}
                            amount={summary.downstreamReferralFee}
                        />
                        <IncentiveCard
                            title={t("incentiveManagementPage.depositAdminChargeRebate")}
                            amount={summary.directTopupRebate}
                        />
                        <IncentiveCard
                            title={t("incentiveManagementPage.directRecruitDepositAdminChargeOverridingRebate")}
                            amount={summary.downstreamTopupRebate}
                        />
                    </div>
                )}

                {/* Bottom Row - Only visible for level 2 and above */}
                {canSeeIncentives && (
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 2xl:gap-7.5">
                        <div className="md:col-span-2">
                            <IncentiveCard
                                title={t("incentiveManagementPage.directRecruitLevelAdvancementBonus")}
                                amount={summary.directRecruitLevelAdvancementBonus}
                                className="h-full"
                            />
                        </div>

                        <div className="md:col-span-4">
                            <IncentiveCard
                                title={t("incentiveManagementPage.performanceBonus")}
                                amount={summary.performance_bonus.amount}
                                className="h-full"
                                // activeUsers={summary.performance_bonus.activeUsers}
                            />
                        </div>
                    </div>
                )}

                {/* Activity Table */}
                <div className="grid gap-4 md:gap-6 2xl:gap-7.5">
                    <DataTable
                        columns={tableColumns}
                        data={activities.activities[currentMonth] || []}
                        title={t("incentiveManagementPage.incentivePayoutRecords")}
                        currentMonth={currentMonth}
                        onMonthChange={(month: string) => setCurrentMonth(month)}
                    />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default IncentiveManagementPage;