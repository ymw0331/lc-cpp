"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import RecruitCard from "@/components/Cards/RecruitCard";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AnalyticChart from "@/components/Charts/AnalyticChart";
import { useState, useEffect } from "react";
import { dashboardApi } from "@/api/dashboard/dashboard.api";
import Loader from "@/components/common/Loader";
import type { DashboardStatistics, ChartRangeData } from "@/types/dashboard";
import { fetchData } from "@/lib/api-utils";
import { useTranslation } from "react-i18next";

const ReferredUsersPage = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [dashboardData, setDashboardData] = useState<DashboardStatistics | null>(
        null
    );

    // Transform deposit activities to chart data points
    const transformActivitiesToChartData = (
        activities: DashboardStatistics["depositActivities"]
    ): ChartRangeData => {
        const processActivities = (
            activities: DashboardStatistics["depositActivities"]
        ) => {
            return activities.map((activity) => ({
                label: new Date(activity.dateTime).toLocaleDateString(),
                value: activity.amount,
            }));
        };

        return {
            Week: processActivities(
                activities.filter((activity) => {
                    const activityDate = new Date(activity.dateTime);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return activityDate >= weekAgo;
                })
            ),
            Month: processActivities(
                activities.filter((activity) => {
                    const activityDate = new Date(activity.dateTime);
                    const monthAgo = new Date();
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return activityDate >= monthAgo;
                })
            ),
            Year: processActivities(
                activities.filter((activity) => {
                    const activityDate = new Date(activity.dateTime);
                    const yearAgo = new Date();
                    yearAgo.setFullYear(yearAgo.getFullYear() - 1);
                    return activityDate >= yearAgo;
                })
            ),
        };
    };

    useEffect(() => {
        fetchData(
            async () => {
                const data = await dashboardApi.getDashboardData();
                if (!data.depositActivities) {
                    console.warn("Missing deposit activities data");
                }
                return data;
            },
            setDashboardData,
            setError,
            setLoading
        );
    }, []);

    if (loading) {
        return (
            <DefaultLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader />
                </div>
            </DefaultLayout>
        );
    }

    if (error || !dashboardData) {
        return (
            <DefaultLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-red-500">{t("referredUsersPage.failedToLoadData")}</p>
                </div>
            </DefaultLayout>
        );
    }

    const chartData =
        dashboardData.depositActivities && dashboardData.depositActivities.length > 0
            ? transformActivitiesToChartData(dashboardData.depositActivities)
            : {
                Week: [],
                Month: [],
                Year: [],
            };

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("referredUsersPage.referredUsersBreadcrumb")} />

            <div className="grid gap-4 md:gap-6 2xl:gap-7.5">
                {/* Recruitment Card */}
                <div className="w-full md:w-2/4">
                    <RecruitCard
                        count={dashboardData.totalDirectRecruit?.count ?? 0}
                        agentsToPartner={{
                            count: dashboardData.totalDirectRecruit?.agentsToPartner ?? 0,
                            trend:
                                (dashboardData.totalDirectRecruit?.agentsToPartner ?? 0) >= 0
                                    ? "up"
                                    : "down",
                        }}
                    />
                </div>

                {/* Chart Section */}
                {dashboardData.depositActivities &&
                    dashboardData.depositActivities.length > 0 ? (
                    <AnalyticChart
                        title={t("referredUsersPage.recruitmentSummary")}
                        chartData={chartData}
                        showLegend={true}
                        legendLabel={t("referredUsersPage.totalDirectRecruit")}
                        legendPosition="top-right"
                        lineColor="#F69732"
                    />
                ) : (
                    <div className="p-6 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark">
                        <div className="flex flex-col items-center justify-center h-[300px]">
                            <p className="text-xl font-medium text-body dark:text-bodydark mb-2">
                                {t("referredUsersPage.noRecruitmentData")}
                            </p>
                            <p className="text-sm text-body dark:text-bodydark">
                                {t("referredUsersPage.startRecruiting")}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default ReferredUsersPage;
