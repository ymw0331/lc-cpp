"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import IncentiveCard from "@/components/Cards/IncentiveCard";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DataTable from "@/components/Tables/DataTable";
import { StarBadgeIcon } from "@/components/Icons/dashboard";
import { IncentivePageData } from "@/types/incentive";
import React, { useEffect, useState } from "react";
import { resellerApi } from "@/api/reseller/reseller.api";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/common/Loader";
import { fetchData } from "@/lib/api-utils";
import { useTranslation } from "react-i18next";

const IncentiveManagementPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [data, setData] = useState<IncentivePageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [currentMonth, setCurrentMonth] = useState<string>(
        new Date().toLocaleString("en-US", { month: "short", year: "numeric" })
    );

    useEffect(() => {
        fetchData(
            async () => {
                const resellerData = await resellerApi.getResellerInfo();
                return resellerApi.transformToIncentiveData(resellerData);
            },
            setData,
            setError,
            setLoading
        );
    }, []);

    const tableColumns = [
        { key: "type", header: t("dataTable.transactionId"), align: "left" as const },
        { key: "amount", header: t("dataTable.transferredAmount"), align: "right" as const },
        { key: "datetime", header: t("dataTable.dateTime"), align: "right" as const },
    ];

    if (!user || loading) {
        return <Loader />;
    }

    if (error || !data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">Failed to load incentive data</p>
            </div>
        );
    }
    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("incentiveManagementPage.incentiveManagementBreadcrumb")} />

            <div className="grid gap-4 md:gap-6 2xl:gap-7.5">
                {/* Top Row */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 2xl:gap-7.5">
                    <div className="col-span-3">
                        <IncentiveCard
                            title={t("incentiveManagementPage.totalIncentive")}
                            amount={data.summary.total_incentive}
                            icon={<StarBadgeIcon />}
                            className="bg-primary text-white h-full"
                        />
                    </div>
                    <div className="col-span-3">
                        <IncentiveCard
                            title={t("incentiveManagementPage.milestoneBonus")}
                            amount={data.summary.milestone_bonus.amount}
                            // badge={{
                            //     text: 'Claimed',
                            //     type: 'claimed'
                            // }}
                            className="h-full"
                        />
                    </div>
                </div>

                {/* Middle Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 2xl:gap-7.5">
                    <IncentiveCard
                        title={t("incentiveManagementPage.directRecruitReferral")}
                        amount={data.summary.direct_recruit_referral}
                    />
                    <IncentiveCard
                        title={t("incentiveManagementPage.directAdminCharge")}
                        amount={data.summary.direct_admin_charge}
                    />
                    <IncentiveCard
                        title={t("incentiveManagementPage.directRecruitDeposit")}
                        amount={data.summary.direct_recruit_deposit}
                    />
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 2xl:gap-7.5">
                    <div className="md:col-span-2">
                        <IncentiveCard
                            title={t("incentiveManagementPage.directRecruitLevel")}
                            amount={data.summary.direct_recruit_level}
                            className="h-full"
                        />
                    </div>

                    <div className="md:col-span-4">
                        <IncentiveCard
                            title={t("incentiveManagementPage.performanceBonus")}
                            amount={data.summary.performance_bonus.amount}
                            className="h-full"
                            // badge={{
                            //     text: 'Fulfilled',
                            //     type: 'fulfilled'
                            // }}
                            activeUsers={data.summary.performance_bonus.activeUsers}
                        />
                    </div>
                </div>

                {/* Activity Table */}
                <div className="grid gap-4 md:gap-6 2xl:gap-7.5">
                    <DataTable
                        columns={tableColumns}
                        data={data.activities[currentMonth] || []}
                        title={t("dataTable.incentiveActivity")}
                        currentMonth={currentMonth}
                        onMonthChange={(month: string) => setCurrentMonth(month)}
                    />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default IncentiveManagementPage;
