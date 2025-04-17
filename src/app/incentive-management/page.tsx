"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import IncentiveCard from "@/components/Cards/IncentiveCard";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DataTable from "@/components/Tables/DataTable";
import { StarBadgeIcon } from "@/components/Icons/dashboard";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchData } from '@/lib/api-utils';
import { incentiveApi } from "@/api/incentive/incentive.api";
import { IncentiveData } from "@/api/incentive/incentive.types";
import { IncentiveManagementSkeleton } from "@/components/common/Skeletons";
import { checkTierPermission, TIER_PERMISSIONS } from "@/utils/permissions";
import { useAuth } from "@/contexts/AuthContext";
import IncentivePayoutTable from "@/components/Tables/IncentivePayoutTable";
import { formatMonthYear } from '@/lib/dateUtils';
import ErrorDisplay from '@/components/common/ErrorDisplay';

const IncentiveManagementPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [currentMonth, setCurrentMonth] = useState(
        formatMonthYear(new Date())
    );

    const [incentiveData, setIncentiveData] = useState<IncentiveData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Use optional chaining to safely handle undefined incentiveData
    const availableMonths = incentiveData?.activities?.activities
        ? Object.keys(incentiveData.activities.activities)
        : [];

    useEffect(() => {
        fetchData(
            incentiveApi.getIncentiveData,
            setIncentiveData,
            setError,
            setLoading
        );

    }, []);

    const tableColumns = [
        { key: "type", header: t("incentivePayoutTable.incentiveRecords"), align: "left" as const },
        { key: "amount", header: t("incentivePayoutTable.transferredAmount"), align: "right" as const },
        { key: "datetime", header: t("incentivePayoutTable.dateTime"), align: "right" as const },
        { key: "action", header: "", align: "center" as const },
    ];

    if (loading)
        return <DefaultLayout><IncentiveManagementSkeleton /></DefaultLayout>;

    if (error || !incentiveData) {
        return <ErrorDisplay errorMessage={error?.message} />;
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
                    <div className="col-span-1 md:col-span-3">
                        <IncentiveCard
                            title={t("incentiveManagementPage.totalIncentive")}
                            amount={summary.total_incentive || 0}
                            icon={<StarBadgeIcon />}
                            className="bg-primary text-white h-full"
                        />
                    </div>

                    <div className="col-span-1 md:col-span-3">
                        {isLevelOneAgent ? (
                            <IncentiveCard
                                title={t("incentiveManagementPage.milestoneAchievementBonus")}
                                amount={summary.milestoneAchievement.milestone_bonus || 0}
                                className="h-full"
                            />
                        ) : (
                            <IncentiveCard
                                title={t('incentiveManagementPage.referralFeeBonus')}
                                amount={summary.directReferralFee || 0}
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
                            amount={summary.downstreamReferralFee || 0}
                            className="h-full"
                        />
                        <IncentiveCard
                            title={t("incentiveManagementPage.depositAdminChargeRebate")}
                            amount={summary.directTopupRebate || 0}
                            className="h-full"
                        />
                        <IncentiveCard
                            title={t("incentiveManagementPage.directRecruitDepositAdminChargeOverridingRebate")}
                            amount={summary.downstreamTopupRebate || 0}
                            className="h-full"
                        />
                    </div>
                )}

                {/* Bottom Row - Only visible for level 2 and above */}
                {canSeeIncentives && (
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 2xl:gap-7.5">
                        <div className="col-span-1 md:col-span-2">
                            <IncentiveCard
                                title={t("incentiveManagementPage.directRecruitLevelAdvancementBonus")}
                                amount={summary.directRecruitLevelAdvancementBonus || 0}
                                className="h-full"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-4">
                            <IncentiveCard
                                title={t("incentiveManagementPage.performanceBonus")}
                                amount={summary.performance_bonus?.amount || 0}
                                className="h-full"
                            />
                        </div>
                    </div>
                )}

                {/* Activity Table */}
                <div className="grid gap-4 md:gap-6 2xl:gap-7.5">
                    <IncentivePayoutTable
                        columns={tableColumns}
                        data={(activities?.activities && currentMonth && activities.activities[currentMonth]) || []}
                        title={t("incentiveManagementPage.incentivePayoutRecords")}
                        currentMonth={currentMonth}
                        onMonthChange={(month: string) => setCurrentMonth(month)}
                        availableMonths={availableMonths}
                    />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default IncentiveManagementPage;