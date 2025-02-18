'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NextLevelCard from "@/components/Cards/NextLevelCard";
import ProgressCard from "@/components/Cards/ProgressCard";
import DemographicSalesChart from "@/components/Charts/DemographicSalesChart";
import SalesSummaryCard from "@/components/Charts/SalesSummaryCard";
import SalesVolumeBarChart from "@/components/Charts/SalesVolumeBarChart";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { AgentLevel, performanceData } from "@/lib/data"; // Adjusted import to match the export
import { checkTierPermission, TIER_PERMISSIONS } from "@/utils/permissions";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import clsx from "clsx";

const PerformancePage = () => {
    const { user } = useAuth();

    const { t } = useTranslation();
    const {
        cardActivationVolume,
        totalAgentRecruitment,
        nextLevelCard,
        salesSummary,
        salesVolumeData,
    } = performanceData;

    const canAccessRecruitment = checkTierPermission(
        user?.tierPriority || 0,
        TIER_PERMISSIONS.MIN_TIER_FOR_RECRUITMENT
    );

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
                            currentValue={cardActivationVolume.currentValue}
                            targetValue={cardActivationVolume.targetValue}
                            suffix={"Active Users"}
                            progressColor={"primary"}
                        />

                        {canAccessRecruitment && (
                            <ProgressCard
                                title={t("performancePage.totalAgentRecruitment")}
                                currentValue={totalAgentRecruitment.currentValue}
                                targetValue={totalAgentRecruitment.targetValue}
                                suffix={"Agents"}
                                progressColor={"primary"}
                            />
                        )}
                    </div>
                    
                    {/* Next Level Card */}
                    <NextLevelCard
                        currentLevel={nextLevelCard.currentLevel ?? AgentLevel.LEVEL_1}
                        progress={nextLevelCard.progress}
                        isMaxLevel={nextLevelCard.isMaxLevel}
                        avatarUrl={nextLevelCard.avatarUrl}
                        name={nextLevelCard.name}
                    />
                </div>

                {/* Right Column - Takes 4 columns (1/3 of space) */}
                <div className="col-span-12 xl:col-span-4">
                    <SalesSummaryCard
                        className="h-full"
                        groupSales={salesSummary.groupSales}
                        personalSales={salesSummary.personalSales}
                    />
                </div>
            </div>

            <div className="mt-4">
                <SalesVolumeBarChart salesVolumeData={salesVolumeData} />
            </div>

            <div className="mt-4">
                <DemographicSalesChart />
            </div>
        </DefaultLayout>
    );
};

export default PerformancePage;
