"use client"
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import RecruitCard from '@/components/Cards/RecruitCard';
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import AnalyticChart from '@/components/Charts/AnalyticChart';
import { recruitData } from '@/lib/data';
import { useTranslation } from "react-i18next";


const ReferredUsersPage = () => {
    const { t } = useTranslation();

    const { count, agentsToPartner, chartData } = recruitData; // Destructure the imported data


    return (
        <DefaultLayout>
            <Breadcrumb pageName={t("referredUsersPage.referredUsersBreadcrumb")} />

            <div className="grid gap-4 md:gap-6 2xl:gap-7.5">
                <div className="w-full md:w-2/4">
                    {/* Top Row */}
                    <RecruitCard
                        count={count}
                        agentsToPartner={{
                            count: agentsToPartner.count ?? 0,
                            trend:
                                (agentsToPartner.count ?? 0) >= 0
                                    ? "up"
                                    : "down",
                        }}
                    />
                </div>

                {/* Chart */}
                <AnalyticChart
                    title={t("referredUsersPage.recruitmentSummary")}
                    chartData={chartData}
                    showLegend={true}
                    legendLabel={t("referredUsersPage.totalDirectRecruit")}
                    legendPosition="top-right"
                    lineColor="#F69732"
                />
            </div>

        </DefaultLayout>
    )
}

export default ReferredUsersPage
