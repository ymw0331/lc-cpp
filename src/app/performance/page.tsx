'use client'
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NextLevelCard from "@/components/Cards/NextLevelCard";
import ProgressCard from "@/components/Cards/ProgressCard";
import DemographicSalesChart from "@/components/Charts/DemographicSalesChart";
import SalesSummaryCard from "@/components/Charts/SalesSummaryCard";
import SalesVolumeBarChart from "@/components/Charts/SalesVolumeBarChart";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { checkTierPermission, TIER_PERMISSIONS } from "@/utils/permissions";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import clsx from "clsx";
import { performanceApi } from "@/api/performance/performance.api";
import Loader from "@/components/common/Loader";

const PerformancePage = () => {
    const { user } = useAuth();
    const { t } = useTranslation();

    const [performanceData, setPerformanceData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchPerformanceData = async () => {
            try {
                const data = await performanceApi.getPerformanceData();
                setPerformanceData(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching performance data:', err);
                setError(err instanceof Error ? err : new Error('Failed to fetch performance data'));
                setLoading(false);
            }
        };

        fetchPerformanceData();
    }, []);

    const canAccessRecruitment = checkTierPermission(
        user?.tierPriority || 0,
        TIER_PERMISSIONS.MIN_TIER_FOR_RECRUITMENT
    );

    if (loading) return <Loader />;


    if (error || !performanceData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">{t('performancePage.failedToLoadData')}</p>
            </div>
        );
    }

    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("performancePage.performanceBreadcrumb")} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-4 h-full">
                {/* Left Column - Takes 8 columns (2/3 of space) */}
                <div className="col-span-12 xl:col-span-8 h-full">
                    {/* Top Cards Grid */}
                    <div className={clsx(
                        "grid gap-4 mb-4",
                        canAccessRecruitment
                            ? "grid-cols-1 md:grid-cols-2"
                            : "grid-cols-1"
                    )}>
                        <ProgressCard
                            title={t("performancePage.cardActivationVolume")}
                            currentValue={performanceData.cardActivationVolume.currentValue}
                            targetValue={performanceData.cardActivationVolume.targetValue}
                            suffix={"Active Users"}
                            progressColor={"primary"}
                        />

                        {canAccessRecruitment && (
                            <ProgressCard
                                title={t("performancePage.totalAgentRecruitment")}
                                currentValue={performanceData.totalAgentRecruitment.currentValue}
                                targetValue={performanceData.totalAgentRecruitment.targetValue}
                                suffix={"Agents"}
                                progressColor={"primary"}
                            />
                        )}
                    </div>

                    {/* Next Level Card */}
                    <NextLevelCard
                        currentLevel={performanceData.nextLevelCard.currentLevel}
                        progress={performanceData.nextLevelCard.progress}
                        isMaxLevel={performanceData.nextLevelCard.isMaxLevel}
                        avatarUrl={performanceData.nextLevelCard.avatarUrl}
                        name={performanceData.nextLevelCard.name}
                    />
                </div>

                {/* Right Column - Takes 4 columns (1/3 of space) */}
                <div className="col-span-12 xl:col-span-4">
                    <SalesSummaryCard
                        className="h-full"
                        groupSales={performanceData.salesSummary.groupSales}
                        personalSales={performanceData.salesSummary.personalSales}
                        comingSoon={true}
                    />
                </div>
            </div>

            <div className="mt-4">
                <SalesVolumeBarChart
                    salesVolumeData={performanceData.salesVolumeData}
                    comingSoon={true}
                />
            </div>

            <div className="mt-4">
                <DemographicSalesChart comingSoon={true} />
            </div>
        </DefaultLayout>
    );
};

export default PerformancePage;